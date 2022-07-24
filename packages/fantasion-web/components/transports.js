import ListGroup from 'react-bootstrap/ListGroup'
import Spinner from 'react-bootstrap/Spinner'

import { ArticleBody } from './articles'
import { BusDepartureIcon, CheckIcon, DownIcon, IconLabel } from './icons'
import { DateRange, DateTimeLabel } from './dates'
import { Heading, Section, ThumbGallery } from './media'
import { Link } from './links'
import { Location } from './locations'
import { slug } from './slugs'
import { useTranslation } from 'next-i18next'

import styles from './transports.module.scss'

const TRANSPORT_IN_PLACE = 2
const TRANSPORT_BOARDING = 3
const TRANSPORT_DEPARTED = 4
const TRANSPORT_ARRIVED = 5

const TravelSpinner = () => (
  <div className={styles.container}>
    <div className={styles.chevron}></div>
    <div className={styles.chevron}></div>
    <div className={styles.chevron}></div>
  </div>
)

const BusSpinner = () => (
  <Spinner
    className="fw-normal fs-6 me-1"
    animation="border"
    role="status"
    size="sm"
  />
)

const ItineraryStepStatus = ({ boarding, departed, arrived }) => {
  const { t } = useTranslation()
  if (departed) {
    return <IconLabel icon={CheckIcon} text={t('transport-departed')} />
  }
  if (arrived) {
    return <IconLabel icon={CheckIcon} text={t('transport-arrived')} />
  }
  if (boarding) {
    return <IconLabel icon={BusSpinner} text={t('transport-boarding')} />
  }
  return null
}

const BusHint = ({ enRoute, inPlace }) => {
  const { t } = useTranslation()
  if (inPlace) {
    return <span className="text-muted">({t('transport-in-place')})</span>
  }
  if (enRoute) {
    return <span className="text-muted">({t('transport-en-route')})</span>
  }
  return null
}

const ItineraryStep = ({
  arrived,
  boarding,
  date,
  departed,
  enRoute,
  inPlace,
  location,
  title,
}) => {
  if (!date || !location) {
    return null
  }
  return (
    <div>
      <Heading>{title}</Heading>
      <div>
        <IconLabel
          icon={BusDepartureIcon}
          text={
            <>
              <DateTimeLabel date={date} />{' '}
              <BusHint enRoute={enRoute} inPlace={inPlace} />
            </>
          }
        />
      </div>
      <div>
        <ItineraryStepStatus
          arrived={arrived}
          boarding={boarding}
          departed={departed}
        />
      </div>
      <Location location={location} />
    </div>
  )
}

const TransportDirection = ({ transport }) =>
  transport.status === TRANSPORT_DEPARTED ? <TravelSpinner /> : <DownIcon />

export const Itinerary = ({ transport }) => {
  const { t } = useTranslation()
  return (
    <Section>
      {transport.description && <ArticleBody text={transport.description} />}
      <ItineraryStep
        date={transport.departsAt}
        boarding={transport.status === TRANSPORT_BOARDING}
        departed={
          transport.status === TRANSPORT_DEPARTED ||
          transport.status === TRANSPORT_ARRIVED
        }
        inPlace={transport.status === TRANSPORT_IN_PLACE}
        location={transport.departsFrom}
        title={t('transport-departure')}
      />
      <TransportDirection transport={transport} />
      <ItineraryStep
        date={transport.arrivesAt}
        arrived={transport.status === TRANSPORT_ARRIVED}
        enRoute={transport.status === TRANSPORT_DEPARTED}
        location={transport.arrivesTo}
        title={t('transport-arrival')}
      />
    </Section>
  )
}

export const Vehicle = ({ vehicle }) => {
  const { t } = useTranslation()
  return (
    <Section>
      {vehicle.title && <Heading>{vehicle.title}</Heading>}
      {vehicle.description && <ArticleBody text={vehicle.description} />}
      <ListGroup className="mt-3">
        {(vehicle.brand || vehicle.model) && (
          <ListGroup.Item>
            {t('vehicle-model')}: {vehicle.brand} {vehicle.model}
          </ListGroup.Item>
        )}
        {vehicle.color && (
          <ListGroup.Item>
            {t('vehicle-color')}: {vehicle.color}
          </ListGroup.Item>
        )}
        {vehicle.year && (
          <ListGroup.Item>
            {t('vehicle-year')}: {vehicle.year}
          </ListGroup.Item>
        )}
      </ListGroup>
      <ThumbGallery media={vehicle.media} />
    </Section>
  )
}

const Troop = ({ troop }) => {
  return (
    <Link
      route="expeditionBatchDetail"
      params={{
        expeditionBatchSlug: slug(troop.batch.id, troop.batch.expedition.title),
      }}
    >
      {troop.batch.expedition.title}
      {' - '}
      {troop.ageGroup.title} (
      <DateRange start={troop.startsAt} end={troop.endsAt} />)
    </Link>
  )
}

export const TransportTroops = ({ troopTransports }) => {
  const { t } = useTranslation()

  if (troopTransports.length === 0) {
    return 0
  }

  return (
    <Section className="mt-3">
      <Heading>{t('transport-carries')}</Heading>
      <ul>
        {troopTransports.map((tt) => (
          <li key={tt.id}>
            <Troop troop={tt.troop} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
