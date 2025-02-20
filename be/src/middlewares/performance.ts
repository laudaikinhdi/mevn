// TODO:
// - api call frequency (per second, minute, hours, day, etc)
// - api call performance (how many ms, seconds took from start to end)
import _ from 'lodash';

export const apiMetric = {}

const getRoute = req => {
   const route = _.get(req, 'route.path', '')
   const baseUrl = req.baseUrl || ''
   if (route) {
      return `${req.method}:${baseUrl === '/' ? '' : baseUrl}${route}`
   } else {
      return 'unknown route'
   }
}

function apiCallPerformanceMiddleWare(req, res, next) {
   const start = Date.now();

   res.on('finish', () => {
      const route = getRoute(req);

      if (res.__error) {
         if (!apiMetric[route]) {
            apiMetric[route] = {n: 1, s: 0, e: 1, avg_ms: 0}
         } else {
            const routeAnalysis = apiMetric[route];
            routeAnalysis.n++;
            routeAnalysis.e++;
         }
      } else {
         const end = Date.now();
         const duration = end - start;
         if (!apiMetric[route]) {
            apiMetric[route] = { n: 1, s: 1, e: 0, avg_ms: duration }
         } else {
            const routeAnalysis = apiMetric[route];
            const { avg_ms, s } = routeAnalysis
            routeAnalysis.avg_ms = _.round((avg_ms * s + duration) / (s + 1), 2);
            routeAnalysis.s++;
            routeAnalysis.n++;
         }
      }
   })

   next()
}

export default apiCallPerformanceMiddleWare;
