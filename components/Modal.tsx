'use client'

import ReactDOM from 'react-dom';
import React, { useRef, useEffect, useState } from 'react'

type ModalProps = {
  children: React.ReactElement | React.ReactElement[]
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>((props, ref) => {

  const bodyRef = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    bodyRef.current = document.body
    setMounted(true)
  }, [])

  return mounted ? ReactDOM.createPortal(props.children, bodyRef.current) : null
})

Modal.displayName = 'Modal'

export default Modal;
