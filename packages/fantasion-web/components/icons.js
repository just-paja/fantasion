/* These are icon bindings. Make sure that all icons used in the application
 * are here to prevent unnecessary confusion from accidentally using different
 * icon for the same purpose. */

import { BsPersonFill, BsPinMapFill } from 'react-icons/bs'
import { HiHome, HiMailOpen } from 'react-icons/hi'
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa'

export const EmailContactIcon = HiMailOpen
export const FacebookIcon = FaFacebook
export const HomeIcon = HiHome
export const InstagramIcon = FaInstagram
export const LocationPinIcon = BsPinMapFill
export const PersonIcon = BsPersonFill
export const TiktokIcon = FaTiktok
export const TwitterIcon = FaTwitter

export const IconLabel = ({ icon: Icon, text }) => (
  <>
    <Icon className="me-1" />
    &nbsp;{text}
  </>
)