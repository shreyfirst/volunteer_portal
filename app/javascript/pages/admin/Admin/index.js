import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { graphql } from 'react-apollo'
import { NetworkStatus } from 'apollo-client'
import { withTranslation } from 'react-i18next'

import AdminQuery from './query.gql'
import OfficeFilter from '../../../components/OfficeFilter'
import { changeAdminOfficeFilter } from 'actions'

import s from './main.css'

const btnClass = (routing, button) => {
  const currentPath = routing.locationBeforeTransitions.pathname
  const crudAction = new RegExp(`${button}/(\\d+|new)`)

  if (currentPath === '/portal/admin' && button === 'dashboard') {
    return `${s.navBtn} ${s.activeBtn}`
  } else if (currentPath.endsWith(`/${button}`) || crudAction.test(currentPath)) {
    return `${s.navBtn} ${s.activeBtn}`
  } else {
    return s.navBtn
  }
}

class Admin extends Component {
  componentDidUpdate() {
    const {
      history,
      data: { networkStatus, currentUser },
    } = this.props

    if (networkStatus !== NetworkStatus.loading && !currentUser.isAdmin) {
      router.push('/portal')
    }
  }

  render() {
    const {
      routing,
      children,
      adminOfficeFilter,
      changeAdminOfficeFilter,
      t,
      data: { currentUser, offices },
    } = this.props

    if (adminOfficeFilter.value === 'current') {
      adminOfficeFilter.value = currentUser.office.id
    }

    return (
      <div className={s.admin}>
        <div className={s.content}>
          <div className={s.navBar}>
            <Link to="/portal/admin">
              <span className={btnClass(routing, 'dashboard')}>{t('volunteer_portal.admin.tab.dashboard')}</span>
            </Link>
            <div className={s.navSpacer} />
            <Link to="/portal/admin/events">
              <span className={btnClass(routing, 'events')}>{t('volunteer_portal.admin.tab.events')}</span>
            </Link>
            <div className={s.navSpacer} />
            <Link to="/portal/admin/event-types">
              <span className={btnClass(routing, 'event-types')}>{t('volunteer_portal.admin.tab.eventtypes')}</span>
            </Link>
            <div className={s.navSpacer} />
            <Link to="/portal/admin/tags">
              <span className={btnClass(routing, 'tags')}>{t('volunteer_portal.admin.tab.tags')}</span>
            </Link>
            <div className={s.navSpacer} />
            <Link to="/portal/admin/offices">
              <span className={btnClass(routing, 'offices')}>{t('volunteer_portal.admin.tab.offices')}</span>
            </Link>
            <div className={s.navSpacer} />
            <Link to="/portal/admin/organizations">
              <span className={btnClass(routing, 'organizations')}>
                {t('volunteer_portal.admin.tab.organizations')}
              </span>
            </Link>
            <div className={s.navSpacer} />
            <Link to="/portal/admin/individual_events">
              <span className={btnClass(routing, 'individual_events')}>
                {t('volunteer_portal.admin.tab.individualevents')}
              </span>
            </Link>
            <div className={s.navSpacer} />
            <Link to="/portal/admin/users">
              <span className={btnClass(routing, 'users')}>{t('volunteer_portal.admin.tab.users')}</span>
            </Link>
            <div className={s.navSpacer} />
            <Link to="/portal/admin/reporting">
              <span className={btnClass(routing, 'reporting')}>{t('volunteer_portal.admin.tab.reporting')}</span>
            </Link>
            <div className={`${s.navSpacer} ${s.growingSpace}`} />
          </div>
          <div className={s.filters}>
            <OfficeFilter value={adminOfficeFilter.value} onChange={changeAdminOfficeFilter} offices={offices} />
          </div>
          {children}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ routing, model: { adminOfficeFilter } }, { children }) => ({
  routing,
  children,
  adminOfficeFilter,
})

const withData = graphql(AdminQuery, {
  options: {
    fetchPolicy: 'cache-and-network',
  },
})

const withActions = connect(
  mapStateToProps,
  {
    changeAdminOfficeFilter,
  }
)

export default withActions(withData(withTranslation()(Admin)))
