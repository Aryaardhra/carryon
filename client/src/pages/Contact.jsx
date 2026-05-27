import React, { useState } from 'react'
import ContactSection from '../components/ContactSection';
import FAQs from '../components/FAQs';

const Contact = () => {
  return (
       <>
    <div className="min-h-screen py-12">
      <div className="space-y-16">
        {/*<CallToAction />*/}
        <ContactSection />
        <FAQs />
      </div>
    </div>
    </>
  )
}

export default Contact