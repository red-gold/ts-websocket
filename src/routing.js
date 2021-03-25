import { dispatchController, dispatchListController, pingController } from './actionControllers'

/**
 * Initialize router
 * @param {exporessApp} app
 */
export const initRouter = (app) => {
  app.get('/ping', pingController)
  app.post('/api/dispatch/:room', dispatchController)
  app.post('/api/dispatch-list/:room', dispatchListController)
}
