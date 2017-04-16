
import * as React from 'react'
import { Component } from 'react'
import { spring, TransitionMotion, presets } from 'react-motion'
import { observer } from "._mobx-react@4.1.7@mobx-react";

interface ImakeOpacityTransitionProp {
  datas?: Object[]
  rootClazz?: string,
  itemClazz?: string

}
interface ImakeOpacityTransitionState {
  datas?: Object[],
}
export interface IAddtionalProps {
  interpolatedStyles?: { style: Object, key: string, data: Object }[]
  className?: string
}

function makeOpacityTransition<Props, State>
  (
  Target: (new () => Component<Props & IAddtionalProps, State>),
  TargetClassName?: string
  ) {

  // tslint:disable-next-line:class-name
  class makeOpacityTransitionComponent extends Component<Props
    & ImakeOpacityTransitionProp, any>{
    state = {
      datas: new Array<Object>()
    }

    componentDidMount() {
      const datas: any = this.props.datas
      this.setState({
        datas: datas
          ? datas.map(this.geneDataItem)
          : React.Children.map(this.props.children, this.geneItemWithoutData)
      })
    }

    componentWillReceiveProps(nextProps) {
      // console.log(nextProps)
      nextProps.datas && this.setState({
        datas: nextProps.datas.map(this.geneDataItem)
      })
    }
    geneItemWithoutData = (item, index) => {
      return this.geneDataItem(null, index);
    }

    geneDataItem = (item, index) => {
      return {
        style: {
          height: 0,
          opacity: 1
        },
        data: item
        , key: `item-${index}`
      }
    }
    getDefaultStyles = () => {
      return this.state.datas.map(this.geneDataItem)
    }

    getStyles = () => {
      return this.state.datas.map((item, index) => {

        return {
          ...item,
          style: {
            // height: spring(100),
            opacity: spring(1)
          }
        }

      })
    }
    willEnter = () => {
      return {
        opacity: 0
      }
    }

    willLeave = () => {

    }

    render() {
      return (
        <TransitionMotion
          defaultStyles={this.getDefaultStyles()}
          styles={this.getStyles()}
          willEnter={this.willEnter}
          willLeave={this.willLeave}
          style={{ width: 'inherit', height: 'inherit' }}
        >
          {
            interpolatedStyles => (
              <Target
                {...this.props}
                className={TargetClassName}
                interpolatedStyles={interpolatedStyles}
              />
            )
          }
        </TransitionMotion>
      )
    }
  }
  return makeOpacityTransitionComponent
}

export default makeOpacityTransition;