import React from 'react'

import * as R from 'ramda'
import { navigate } from 'react-big-calendar/lib/utils/constants'
import { withTranslation } from 'react-i18next'

import ShowFilter from 'components/ShowFilter'
import EventFilter from 'components/EventFilter'
import HouseFilter from 'components/HouseFilter'
import FilterGroup from 'components/FilterGroup'

import LeftIcon from '@zendeskgarden/svg-icons/src/12/chevron-left-fill.svg'
import RightIcon from '@zendeskgarden/svg-icons/src/12/chevron-right-fill.svg'

import s from './main.css'
import styled from 'styled-components'

const translations = R.flip(R.mapObjIndexed)({
  month: 'volunteer_portal.calendar.bigcalendar.month',
  week: 'volunteer_portal.calendar.bigcalendar.week',
  work_week: 'volunteer_portal.calendar.bigcalendar.work_week',
  day: 'volunteer_portal.calendar.bigcalendar.day',
  agenda: 'volunteer_portal.calendar.bigcalendar.agenda',
  today: 'volunteer_portal.dashboard.layoutdatetab.today',
})

const Margin = styled.div`
  margin-left: ${({ theme }) => theme.space.xxs};
  margin-bottom: ${({ theme }) => theme.space.xxs};
`

const Toolbar = ({ label, view, views, onNavigate, onViewChange, t }) => {
  const text = translations(t)

  return (
    <div className={s.toolbar}>
      <div className={s.navBar}>
        <button className={s.todayBtn} type="button" onClick={() => onNavigate(navigate.TODAY)}>
          {text.today}
        </button>
        <button className={s.btn} type="button" onClick={() => onNavigate(navigate.PREVIOUS)}>
          <LeftIcon />
        </button>
        <span className={s.label}>{label}</span>
        <button className={s.btn} type="button" onClick={() => onNavigate(navigate.NEXT)}>
          <RightIcon />
        </button>
      </div>
      <div className={s.filterBar}>
        <FilterGroup>
          <Margin>
            <ShowFilter />
          </Margin>
          <Margin>
            <EventFilter />
          </Margin>
          <Margin>
            <HouseFilter />
          </Margin>
        </FilterGroup>
        <div>
          {views.map(viewName => (
            <button
              key={viewName}
              className={view === viewName ? `${s.btn} ${s.activeBtn}` : s.btn}
              onClick={() => onViewChange(viewName)}
            >
              {R.prop(viewName, text)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default withTranslation()(Toolbar)
