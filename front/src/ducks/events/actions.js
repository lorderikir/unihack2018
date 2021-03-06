import CalendarService from '../../services/CalendarService'

import * as types from './types'

const setFetching = () => ({
  type: types.FETCHING,
})

const setErrored = error => ({
  type: types.ERRORED,
  error,
})

const setFulfilled = payload => ({
  type: types.FULFILLED,
  payload,
})

const setUpdated = (eventId, newRating) => ({
  type: types.UPDATE_TYPES,
  payload: { rating: newRating },
  eventId: eventId,
})

export const updateEventPirority = (eventId, newRating) => {
  return function(dispatch) {
    dispatch(setUpdated(eventId, newRating))
  }
}

export const updateEventList = () => dispatch => {
  dispatch(setFetching())

  CalendarService.updateEvents()
    .then(resp => {
      console.log(resp)
      const events = resp
        .filter(event => event.status !== 'cancelled')
        .map((event, key) => {
          return {
            id: key,
            title: event.summary,
            allDay: false,
            start: new Date(event.start.dateTime),
            end: new Date(event.end.dateTime),
            description: event.description,
            organizer: event.organizer,
            creator: event.creator,
            link: event.htmlLink,
            location: event.location,
            priority: 1,
          }
        })
      dispatch(setFulfilled(events))
    })
    .catch(err => {
      dispatch(setErrored(err))
    })
}

export const loadEvents = () => dispatch => {
  dispatch(setFetching())

  CalendarService.getEvents()
    .then(resp => {
      const events = resp.items
        .filter(event => event.status !== 'cancelled')
        .map((event, key) => {
          return {
            id: key,
            title: event.summary,
            allDay: false,
            start: new Date(event.start.dateTime),
            end: new Date(event.end.dateTime),
            description: event.description,
            organizer: event.organizer,
            creator: event.creator,
            link: event.htmlLink,
            location: event.location,
            priority: 1,
          }
        })
      dispatch(setFulfilled(events))
    })
    .catch(err => {
      dispatch(setErrored(err))
    })
}
