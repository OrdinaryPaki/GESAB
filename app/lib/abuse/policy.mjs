// Fixed UTC windows. Limits are shared across every instance, not per process.
export function contactBudgets(kind, actor, recipient) {
  if (kind === 'inquiry') return {
    attempts:[{key:'attempt-global',limit:10000,seconds:86400},{key:'attempt:'+actor,limit:40,seconds:900}],
    budgets:[{key:'global',limit:200,seconds:86400},{key:'global-burst',limit:50,seconds:600},
      {key:'actor:'+actor,limit:5,seconds:900},{key:'actor-day:'+actor,limit:20,seconds:86400},
      {key:'recipient:'+recipient,limit:3,seconds:3600},{key:'recipient-day:'+recipient,limit:5,seconds:86400}],
  };
  if (kind === 'phone') return {
    attempts:[{key:'attempt-global',limit:100000,seconds:86400},{key:'attempt:'+actor,limit:60,seconds:600}],
    budgets:[{key:'global',limit:10000,seconds:86400},{key:'global-burst',limit:1000,seconds:600},
      {key:'actor:'+actor,limit:20,seconds:600},{key:'actor-day:'+actor,limit:100,seconds:86400}],
  };
  throw new Error('Unknown contact kind');
}
