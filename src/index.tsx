import PropTypes from 'prop-types'
import React from 'react'

interface Props {
  text: string
}

const C: React.FC<Props> = ({ text }) => <p>{text}</p>

C.propTypes = {
  text: PropTypes.string.isRequired,
}

export default C
