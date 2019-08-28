import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import {
  formValueSelector,
  Field,
  change
} from 'redux-form'
import InputField from '../../../../../elements/InputField'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import DropDown from '../../../../../elements/DropDown'

const portal = document.createElement('div')
portal.classList.add('draggable-portal')

class DropDownElement extends Component {

  render() {
    const {
      index,
      addNewSection,
      copySection,
      removeSection,
      input: { name }
    } = this.props
    
    const newDDElementOtions = [
      {
        title: 'New section above',
        icon: 'section-above-icon',
        onClick: ((index) => addNewSection(index))
      },
      {
        title: 'New section below',
        icon: 'section-below-icon',
        onClick: ((index) => addNewSection(index + 1))
      },
      {
        title: 'Copy',
        icon: 'copy-icon',
        onClick: ((index) => copySection(index))
      },
      {
        title: 'Delete',
        icon: 'trash-icon',
        onClick: ((index) => removeSection(index))
      }
    ]
    document.body.appendChild(portal)
    
    return (
      <Draggable draggableId={`field_${index}`} index={index}>
        {(provided, snapshot) => {
          const usePortal = snapshot.isDragging

          const child = (
            <div
              className={classnames('draggable-container', { 'dragging': snapshot.isDragging })}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <div className='dropdown-section'>
                <Field
                  component={InputField}
                  name={`${name}.value`}
                  className='dropdown-section__input-block'
                />
                <DropDown
                  dots={true}
                  className='dropdown-with-icon dropleft ml-2'
                >
                  {newDDElementOtions.map(({icon, title, onClick }, i) => (
                    <React.Fragment key={i}>
                      <li
                        className='dropdown-item'
                        onClick={() => onClick(index)}
                      >
                        <i className={classnames('svg-icon gray mr-2', icon)} />
                        <span className='item-text'>{title}</span>
                      </li>
                    </React.Fragment>
                  ))}
                </DropDown>
              </div>
            </div>
          )
          if (!usePortal) return child
          
          return ReactDOM.createPortal(child, portal)
        }}
      </Draggable>
    )
  }
}

class DropDownColumn extends Component {

  constructor(props) {
    super(props)
    this.renderElement = this.renderElement.bind(this)
  }

  renderElement(props) {
    const { addNewSection, copySection, removeSection} = this.props
    return (
      <DropDownElement
        {...props}
        addNewSection={addNewSection}
        copySection={copySection}
        removeSection={removeSection}
      />
    )
  }

  render() {
    const { fields } = this.props

    return (
      <Droppable droppableId='column_1'>
        {provided => (
          <div
            className='dropdown-section-block form-group'
            ref={provided.innerRef}
            style={{}}
            {...provided.droppableProps}
          >
            {fields.map((field, i) => (
              <Field
                key={i}
                name={field}
                component={this.renderElement}
                index={i}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    )
  }
}

class DraggableDropDown extends Component {

  onDragEnd = result => {
    const { fields } = this.props
    const { destination, source } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    fields.move(source.index, destination.index)
  }

  addNewSection = (e, index) => {
    e.preventDefault()
    const { discardNewSection, newSection, fields } = this.props
    if (index === undefined && newSection.length < 1) return

    const position = index > -1 ? index : fields.length
    const newValue = {
      id: null,
      value: newSection,
      title: ''
    }
    fields.splice(position, 0, newValue)
    discardNewSection()
  }

  removeSection = index => {
    const { fields } = this.props
    fields.remove(index)
  }

  copySection = index => {
    const { fields } = this.props
    const newValue = fields.get(index)
    fields.splice(index, 0, newValue)
  }

  render() {
    const { fields } = this.props

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <DropDownColumn
          {...this.props}
          addNewSection={this.addNewSection}
          removeSection={this.removeSection}
          copySection={this.copySection}
        />
        <div className='new-dropdown-section-block form-froup'>
          <div className='new-dropdown-section'>
            <Field
              component={InputField}
              id='new_section'
              name='new_section'
              placeholder={`Section ${fields.length + 1}`}
              onBlur={e => this.addNewSection(e)}
            />
          </div>
        </div>
      </DragDropContext>
    )
  }
}

const selector = formValueSelector('convention_input_form')

const mapStateToProps = state => ({
  newSection: selector(state, 'new_section')
})

const mapDispatchToProps = dispatch => ({
  discardNewSection: () => dispatch(change('convention_input_form', 'new_section', ''))
})

export default connect(mapStateToProps, mapDispatchToProps)(DraggableDropDown)