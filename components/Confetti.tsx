import React, { Component, Fragment } from 'react'

interface Props {
  enabled: boolean
}

class Confetti extends Component<Props> {
  render() {
    const { enabled } = this.props

    if (!enabled) return null

    return (
      <Fragment>
        <div className="confetti-base confetti-1" />
        <div className="confetti-base confetti-2" />
        <div className="confetti-base confetti-3" />
        <div className="confetti-base confetti-4" />
        <div className="confetti-base confetti-5" />
        <div className="confetti-base confetti-6" />
        <div className="confetti-base confetti-7" />
        <div className="confetti-base confetti-8" />
        <div className="confetti-base confetti-9" />
        <div className="confetti-base confetti-10" />
        <div className="confetti-base confetti-11" />
        <div className="confetti-base confetti-12" />
        <div className="confetti-base confetti-13" />
        <div className="confetti-base confetti-14" />
        <div className="confetti-base confetti-15" />
        <div className="confetti-base confetti-16" />
        <div className="confetti-base confetti-17" />
        <div className="confetti-base confetti-18" />
        <div className="confetti-base confetti-19" />
        <div className="confetti-base confetti-20" />
      </Fragment>
    )
  }
}

export default Confetti
