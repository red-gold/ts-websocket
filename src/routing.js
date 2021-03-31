import { dispatchController, dispatchListController, pingController } from './actionControllers'

/**
 * Initialize router
 * @param {exporessApp} app
 */
export const initRouter = (app, io) => {
  app.get('/ping', pingController(io))
  app.post('/api/dispatch/:room', dispatchController(io))
  app.post('/api/dispatch-list/:room', dispatchListController(io))
}
