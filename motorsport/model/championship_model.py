"""Race Board empirical weekend bootstrap. Offline, deterministic given inputs and seed."""
import argparse,hashlib,json,time,platform
from pathlib import Path
from datetime import datetime,timezone
from collections import Counter,defaultdict
import numpy as np

VERSION='weekend-bootstrap-1.0.0'
RULES={
 'f1':{'race':[25,18,15,12,10,8,6,4,2,1],'sprint':[8,7,6,5,4,3,2,1]},
 'moto':{'race':[25,20,16,13,11,10,9,8,7,6,5,4,3,2,1],'sprint':[12,9,7,6,5,4,3,2,1]}}

def weights(count,half_life):
    w=2.0**((np.arange(count)-(count-1))/half_life)
    return w/w.sum()

def eligible(points,max_remaining,base_wins,future_gps):
    leader=int(max(points));leader_index=int(np.argmax(points));out=[]
    for i,p in enumerate(points):
        maximum=int(p)+max_remaining
        if maximum>leader:status='Yes'
        elif maximum<leader:status='No'
        elif int(base_wins[i])+future_gps>int(base_wins[leader_index]):status='Yes (GP wins tie-break)'
        elif int(base_wins[i])+future_gps<int(base_wins[leader_index]):status='No (GP wins tie-break)'
        else:status='Further countback required'
        out.append({'max_points':maximum,'status':status})
    return out

def validate_inputs(data,key):
    d=data[key];totals=Counter();teams=Counter()
    for r in d['rounds']:
        for session in ['race','sprint']:
            if session not in r:continue
            entries=r[session]['entries'];seen=set();positions=[]
            for e in entries:
                assert e['name'] not in seen,(key,r['round'],session,'duplicate entrant')
                seen.add(e['name']);p=e.get('position');pts=e['points']
                assert pts>=0
                expected=RULES[key][session][p-1] if p and p<=len(RULES[key][session]) else 0
                assert pts==expected,(key,r['round'],session,e['name'],pts,expected)
                if p:positions.append(p)
                totals[e['name']]+=pts;teams[e['team']]+=pts
            assert len(set(positions))==len(positions)
            assert sum(e['points'] for e in entries)<=sum(RULES[key][session])
    assert all(totals[n]==p for n,t,p in d['standings']),(key,'standings reconciliation')
    assert set(totals)<=set(n for n,t,p in d['standings']),(key,'unlisted entrants')
    if key=='f1':
        assert all(teams[n]==p for n,p in d['constructors']),('constructors reconciliation',teams)
        assert sum(p for n,t,p in d['standings'])==sum(p for n,p in d['constructors'])

def entrants(d,key):
    # Regular 2026 grid. Remaining-seat assumptions are explicit in the input file.
    active=[n for n,t,p in d['standings'] if (n!='Yuki Tsunoda' if key=='f1' else n not in ['Iker Lecuona','Augusto Fernández','Pol Espargaró','Takaaki Nakagami','Cal Crutchlow','Jonas Folger','Lorenzo Savadori','Michele Pirro'])]
    assert len(active)==22
    return active

def map_name(e,key,entries):
    n=e['name']
    if key=='f1':
        if n=='Liam Lawson' and e.get('team')=='Red Bull Racing':return 'Isack Hadjar'
        if n=='Yuki Tsunoda':return 'Liam Lawson'
    else:
        if n in ['Iker Lecuona','Michele Pirro'] and 'Gresini' in e['team']:
            present={x['name'] for x in entries};missing=[x for x in ['Álex Márquez','Fermín Aldeguer'] if x not in present]
            assert len(missing)==1, 'ambiguous Gresini substitute seat'
            return missing[0]
        if n=='Lorenzo Savadori':
            return 'Ai Ogura' if 'Trackhouse' in e['team'] else n
        n={'Pol Espargaró':'Maverick Viñales','Jonas Folger':'Maverick Viñales','Takaaki Nakagami':'Joan Mir','Cal Crutchlow':'Johann Zarco'}.get(n,n)
    return n

def history_arrays(d,key,names):
    size=len(names);ix={n:i for i,n in enumerate(names)}
    matrices={};base_counts=np.zeros((size,size),dtype=np.int16)
    base_q=np.zeros_like(base_counts);last_best=np.full((size,size),-1,dtype=np.int16)
    for session in ['race','sprint','qualifying']:
        if key=='moto' and session=='qualifying':continue
        arr=[];pool=[]
        for rd,r in enumerate(d['rounds']):
            if session not in r:continue
            vec=np.zeros(size,dtype=np.int16);classified=[];mapped_seen=set()
            for e in r[session]['entries']:
                p=e.get('position');original=e['name']
                if session=='race' and p and original in ix:
                    base_counts[ix[original],p-1]+=1;last_best[ix[original],p-1]=rd
                if session=='qualifying' and p and original in ix:base_q[ix[original],p-1]+=1
                n=map_name(e,key,r[session]['entries'])
                if n in ix:
                    assert n not in mapped_seen,(key,rd,session,n,'seat collision')
                    mapped_seen.add(n)
                    if p:classified.append((p,ix[n]))
            # Remove unscheduled wildcard entries; compact the remaining classified field.
            for pos,(_,i) in enumerate(sorted(classified),1):vec[i]=pos
            arr.append(vec);pool.append(rd)
        matrices[session]={'positions':np.asarray(arr,dtype=np.int16),'round_indices':np.asarray(pool)}
    return matrices,base_counts,base_q,last_best

def score(position,scale):
    lookup=np.array([0]+scale+[0]*32,dtype=np.int16)
    return lookup[position]

def narrow(candidates,values):
    best=np.where(candidates,values,np.iinfo(np.int16).min).max(axis=1)
    return candidates & (values==best[:,None])

def champions(points,counts,qcounts,key,last_dates):
    cand=points==points.max(axis=1)[:,None]
    for pos in range(counts.shape[2]):
        if np.all(cand.sum(axis=1)==1):break
        cand=narrow(cand,counts[:,:,pos])
    if key=='f1':
        for pos in range(qcounts.shape[2]):
            if np.all(cand.sum(axis=1)==1):break
            cand=narrow(cand,qcounts[:,:,pos])
    else:
        # Counts now match. Use the latest achievement of the highest GP place.
        best_place=np.argmax(counts>0,axis=2)
        date=np.take_along_axis(last_dates,best_place[:,:,None],axis=2)[:,:,0]
        cand=narrow(cand,date)
    assert np.all(cand.sum(axis=1)>=1), 'countback removed every candidate'
    unresolved=cand.sum(axis=1)>1
    return cand,unresolved

def run_series(data,key,trials,seed,half_life,concentration,batch_size):
    validate_inputs(data,key);d=data[key];names=entrants(d,key);n=len(names)
    start_pts={r[0]:r[2] for r in d['standings']};initial=np.array([start_pts[x] for x in names],dtype=np.int16)
    mats,base_counts,base_q,last_best=history_arrays(d,key,names)
    allweights=weights(len(d['rounds']),half_life);alpha=allweights*concentration
    rng=np.random.Generator(np.random.PCG64(seed));wins=np.zeros(n,dtype=np.int64);unresolved_total=0
    if key=='f1':
        ctor_names=[r[0] for r in d['constructors']];ctor_initial=np.array([r[1] for r in d['constructors']],dtype=np.int16)
        team={r[0]:r[1] for r in d['standings']};teamix=np.array([ctor_names.index(team[x]) for x in names]);membership=np.zeros((n,len(ctor_names)),dtype=np.int16);membership[np.arange(n),teamix]=1
        assert np.all(membership.sum(axis=0)==2)
        # Historical constructor countbacks keep the team actually represented on the day.
        cb=np.zeros((len(ctor_names),n),dtype=np.int16);qb=cb.copy()
        for r in d['rounds']:
            for s,arr in [('race',cb),('qualifying',qb)]:
                for e in r[s]['entries']:
                    if e.get('position'):arr[ctor_names.index(e['team']),e['position']-1]+=1
        ctor_wins=np.zeros(len(ctor_names),dtype=np.int64);ctor_unresolved=0
    recent_indices=[]
    for done in range(0,trials,batch_size):
        b=min(batch_size,trials-done);pts=np.tile(initial,(b,1));counts=np.tile(base_counts,(b,1,1));qc=np.tile(base_q,(b,1,1));last=np.tile(last_best,(b,1,1))
        w=rng.gamma(alpha,1.0,size=(b,len(alpha)));w/=w.sum(axis=1)[:,None]
        if key=='f1':cp=np.tile(ctor_initial,(b,1));cc=np.tile(cb,(b,1,1));cq=np.tile(qb,(b,1,1))
        for future,event in enumerate(d['remaining_calendar']):
            # A shared draw keeps each observed weekend's GP/Sprint/qualifying correlation.
            pool=mats['sprint']['round_indices'] if (key=='moto' or event.get('sprint')) else np.arange(len(alpha))
            wp=w[:,pool];wp/=wp.sum(axis=1)[:,None];u=rng.random(b)
            choice=(u[:,None]>np.cumsum(wp,axis=1)).sum(axis=1);choice=np.minimum(choice,len(pool)-1);rd=pool[choice]
            pos=mats['race']['positions'][rd].copy()
            # Motegi's confirmed HRC substitute cannot score for Mir. Chantra is mathematically out.
            override=data.get('entry_overrides',{}).get(key,{}).get(str(event['rd']),{})
            if override:
                for unavailable,replacement in override.items():
                    if unavailable in names:pos[:,names.index(unavailable)]=0
            scored=score(pos,RULES[key]['race']);pts+=scored
            increments=(pos[:,:,None]==np.arange(1,n+1)[None,None,:]).astype(np.int16)
            counts+=increments;last=np.where(increments>0,len(d['rounds'])+future,last)
            if key=='f1':
                qpos=mats['qualifying']['positions'][rd];qadd=(qpos[:,:,None]==np.arange(1,n+1)[None,None,:]).astype(np.int16);qc+=qadd
                cp+=scored@membership;cc+=np.einsum('bnp,nt->btp',increments,membership);cq+=np.einsum('bnp,nt->btp',qadd,membership)
            if key=='moto' or event.get('sprint'):
                inv={int(r):i for i,r in enumerate(mats['sprint']['round_indices'])};sidx=np.array([inv[int(r)] for r in rd])
                spos=mats['sprint']['positions'][sidx].copy()
                for unavailable,replacement in override.items():
                    if unavailable in names:spos[:,names.index(unavailable)]=0
                ss=score(spos,RULES[key]['sprint']);pts+=ss
                if key=='f1':cp+=ss@membership
            max_rem=sum(RULES[key]['race'][0]+(RULES[key]['sprint'][0] if key=='moto' or e.get('sprint') else 0) for e in d['remaining_calendar'][:future+1])
            assert np.all(pts>=initial) and np.all(pts<=initial+max_rem)
        cand,unresolved=champions(pts,counts,qc,key,last);unresolved_total+=int(unresolved.sum());wins+=np.sum(cand & ~unresolved[:,None],axis=0)
        if key=='f1':
            ccan,cun=champions(cp,cc,cq,'f1',None);ctor_unresolved+=int(cun.sum());ctor_wins+=np.sum(ccan & ~cun[:,None],axis=0)
            inactive_points=sum(p for name,team,p in d['standings'] if name not in names)
            assert np.all(cp.sum(axis=1)==pts.sum(axis=1)+inactive_points)
    max_rem=sum(RULES[key]['race'][0]+(RULES[key]['sprint'][0] if key=='moto' or e.get('sprint') else 0) for e in d['remaining_calendar'])
    # Eligibility is reported for every listed entrant, including substitutes without planned starts.
    all_names=[r[0] for r in d['standings']];all_pts=np.array([r[2] for r in d['standings']]);all_wins=np.array([sum(e['name']==name and e.get('position')==1 for r in d['rounds'] for e in r['race']['entries']) for name in all_names])
    el=eligible(all_pts,max_rem,all_wins,len(d['remaining_calendar']))
    result={'seed':seed,'simulations':trials,'rounds_observed':len(d['rounds']),'gps_remaining':len(d['remaining_calendar']),'sprints_remaining':sum(key=='moto' or e.get('sprint',False) for e in d['remaining_calendar']),'maximum_remaining_points':max_rem,'unresolved_tie_trials':unresolved_total,'rows':[]}
    for j,(name,team,p) in enumerate(d['standings']):
        count=int(wins[names.index(name)]) if name in names else 0
        result['rows'].append({'name':name,'points':p,'simulated_titles':count,'probability':count/trials,'mathematical':el[j],'modelled':name in names})
    assert wins.sum()+unresolved_total==trials
    assert all(r['simulated_titles']==0 for r in result['rows'] if r['mathematical']['status'].startswith('No'))
    if key=='f1':
        cm=sum(43+(15 if e.get('sprint') else 0) for e in d['remaining_calendar']);ce=eligible(ctor_initial,cm,cb[:,0],len(d['remaining_calendar']))
        result['constructors']={'maximum_remaining_points':cm,'unresolved_tie_trials':ctor_unresolved,'rows':[{'name':name,'points':int(ctor_initial[i]),'simulated_titles':int(ctor_wins[i]),'probability':float(ctor_wins[i]/trials),'mathematical':ce[i]} for i,name in enumerate(ctor_names)]}
        assert ctor_wins.sum()+ctor_unresolved==trials
    return result

def backtest(data,key,half_life):
    d=data[key];names=entrants(d,key);mats,_,_,_=history_arrays(d,key,names)
    rows=[]
    for cut in range(max(5,len(d['rounds'])-5),len(d['rounds'])):
        w=weights(cut,half_life);pos=mats['race']['positions'];observed_winner=np.argmax(pos[cut]==1)
        p=(w[:,None]*(pos[:cut]==1)).sum(axis=0);target=np.zeros(len(names));target[observed_winner]=1
        expected=(w[:,None]*score(pos[:cut],RULES[key]['race'])).sum(axis=0);actual=score(pos[cut],RULES[key]['race'])
        rows.append({'test_round':cut+1,'training_rounds':cut,'winner_brier':float(np.sum((p-target)**2)),'race_points_mae':float(np.mean(abs(expected-actual)))})
    return {'type':'rolling-origin one-GP check using only earlier rounds','rounds':rows,'mean_winner_brier':float(np.mean([r['winner_brier'] for r in rows])),'mean_race_points_mae':float(np.mean([r['race_points_mae'] for r in rows])),'championship_calibration':'Unavailable: no completed championship backtest in this input set. Five held-out GPs are a diagnostic, not proof of calibration.'}

def self_checks():
    # True GP countback, qualifying fallback and MotoGP latest-achievement tie-break.
    p=np.array([[100,100]]);c=np.zeros((1,2,2),dtype=np.int16);q=c.copy();last=c.copy()
    c[0,0,0]=2;c[0,1,0]=1
    assert champions(p,c,q,'f1',None)[0].tolist()==[[True,False]]
    c[:]=0;q[0,1,0]=1
    assert champions(p,c,q,'f1',None)[0].tolist()==[[False,True]]
    c[:]=1;last[0,0,0]=3;last[0,1,0]=4
    assert champions(p,c,q,'moto',last)[0].tolist()==[[False,True]]
    assert eligible(np.array([100,90]),10,np.array([2,0]),1)[1]['status'].startswith('No')
    assert score(np.array([0,1,10,11]),RULES['f1']['race']).tolist()==[0,25,1,0]
    assert narrow(np.array([[True,False]]),np.array([[2,1]],dtype=np.int16)).tolist()==[[True,False]]

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--inputs',type=Path,required=True);parser.add_argument('--output',type=Path,required=True);parser.add_argument('--simulations',type=int,default=200000);parser.add_argument('--seed',type=int,default=20260930);parser.add_argument('--half-life',type=float,default=5.0);parser.add_argument('--concentration',type=float,default=15.0);parser.add_argument('--batch-size',type=int,default=10000);args=parser.parse_args()
    assert args.simulations>=200000;start=time.perf_counter();stamp=datetime.now(timezone.utc).isoformat();raw=args.inputs.read_bytes();data=json.loads(raw);self_checks()
    result={'model_version':VERSION,'calculated_at_utc':stamp,'input_sha256':hashlib.sha256(raw).hexdigest(),'code_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'python_version':platform.python_version(),'numpy_version':np.__version__,'generator':'PCG64','parameters':{'half_life_weekends':args.half_life,'dirichlet_concentration':args.concentration,'batch_size':args.batch_size},'assumptions':['Full scheduled calendar and full distance points.','Remaining tracks are exchangeable with observed 2026 weekends, weighted by recency.','Weekend outcomes are resampled together, retaining empirical retirement and incident correlations.','Historical substitute seats map to the current regular grid; explicit next-event entry overrides apply.','Injury absences and penalties in the sampled data remain part of the empirical distribution.','No explicit track, weather, qualifying-development, future grid penalty or team-order forecast.','Finite empirical support cannot generate every mathematically possible upset. Zero simulated titles do not mean elimination.'],'f1':run_series(data,'f1',args.simulations,args.seed,args.half_life,args.concentration,args.batch_size),'moto':run_series(data,'moto',args.simulations,args.seed+1,args.half_life,args.concentration,args.batch_size),'backtests':{k:backtest(data,k,args.half_life) for k in ['f1','moto']},'checks':{'input_scoring_and_standings_reconciliation':True,'unique_finishing_positions':True,'point_bounds':True,'one_champion_or_explicit_unresolved_tie_per_trial':True,'constructor_driver_points_reconcile':True,'tie_break_self_checks':True,'mathematically_eliminated_entrants_have_no_simulated_titles':True}}
    result['calculation_seconds']=round(time.perf_counter()-start,3);args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'model_version':VERSION,'seconds':result['calculation_seconds'],'f1_trials':args.simulations,'moto_trials':args.simulations,'unresolved_ties':[result['f1']['unresolved_tie_trials'],result['moto']['unresolved_tie_trials'],result['f1']['constructors']['unresolved_tie_trials']]}))

if __name__=='__main__':main()
