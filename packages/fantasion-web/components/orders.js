import Alert from 'react-bootstrap/Alert'
import Carousel from 'react-bootstrap/Carousel'
import classnames from 'classnames'
import ListGroup from 'react-bootstrap/ListGroup'
import Modal from 'react-bootstrap/Modal'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import styles from './orders.module.scss'

import { Address, PostalCodeInput, StreetNumberInput } from './addresses'
import { CancelIcon } from './icons'
import { CopyButton, InteractiveButton } from './buttons'
import { Form, FormControls, Input } from './forms'
import { Heading, Section } from './media'
import { useFetch, useUser } from './context'
import { useFormContext } from 'react-hook-form'
import { UserName } from './users'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'

import {
  Money,
  PaymentQrCode,
  ACCOUNT_BIC,
  ACCOUNT_IBAN,
  ACCOUNT_NUMBER,
  DEFAULT_CURRENCY,
} from './money'

const ORDER_STATUS_CONFIRMED = 2
const ORDER_STATUS_DEPOSIT_PAID = 3

const OrderStatusMap = {
  1: 'order-status-new',
  [ORDER_STATUS_CONFIRMED]: 'order-status-confirmed',
  [ORDER_STATUS_DEPOSIT_PAID]: 'order-status-deposit-paid',
  4: 'order-status-paid',
  5: 'order-status-dispatched',
  6: 'order-status-resolved',
  7: 'order-status-cancelled',
}

const CAN_BE_PAID = [ORDER_STATUS_CONFIRMED, ORDER_STATUS_DEPOSIT_PAID]

const OrderStatus = ({ status }) => useTranslation().t(OrderStatusMap[status])

const OrderItemPromotionCode = () => useTranslation().t('order-promotion-code')

const OrderItemSignup = ({ signup }) => (
  <>
    <UserName user={signup.participant} />
    <div className={styles.troopDescription}>
      {signup.troop.batch.expedition.title}: {signup.troop.ageGroup.title}
    </div>
  </>
)

const OrderItemDescription = ({ item }) => {
  if (item.productType === 'fantasion_signups.Signup') {
    return <OrderItemSignup signup={item} />
  }
  if (item.productType === 'fantasion_eshop.OrderPromotionCode') {
    return <OrderItemPromotionCode code={item} />
  }
  return item.description
}

const OrderItem = ({ item, onDelete }) => (
  <div className="d-flex">
    <ListGroup.Item className="d-flex flex-fill">
      <div className="flex-grow-1">
        <OrderItemDescription item={item} />
      </div>
      <div className="text-end">
        <Money amount={item.price} />
      </div>
    </ListGroup.Item>
    {onDelete && (
      <InteractiveButton
        icon={CancelIcon}
        onClick={() => onDelete(item)}
        variant="danger"
      />
    )}
  </div>
)

const OrderItems = ({ items, onDelete }) => (
  <ListGroup className="mt-2">
    {items.map((item) => (
      <OrderItem item={item} key={item.id} onDelete={onDelete} />
    ))}
  </ListGroup>
)

const OrderRow = ({
  align = 'text-end',
  className,
  copyPasta,
  label,
  value,
  ...props
}) => (
  <div {...props} className={classnames(align, className)}>
    <span className={styles.orderRowLabel}>{label}:</span>{' '}
    <span
      className={classnames(styles.orderRowValue, {
        [styles.copyPasta]: copyPasta,
      })}
    >
      {value}
      {copyPasta && <CopyButton value={copyPasta} />}
    </span>
  </div>
)

const MoneyRow = ({ amount, label, ...props }) => (
  <OrderRow {...props} label={label} value={<Money amount={amount} />} />
)

const OrderPayDialog = ({ payAs, onHide, order, show }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const { t } = useTranslation()
  const user = useUser()
  const markAsPaid = () => setActiveIndex(1)
  const amount =
    payAs == 'surcharge' ? order.price - order.deposit : order[payAs]
  return (
    <Modal show={show} onHide={onHide} onExited={() => setActiveIndex(0)}>
      <Modal.Header closeButton>
        <Modal.Title>{t('order-pay')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Carousel
          activeIndex={activeIndex}
          indicators={false}
          touch={false}
          wrap={false}
          controls={false}
        >
          <Carousel.Item>
            <p>{t('order-send-payment')}</p>
            <div className="mt-3">
              <OrderRow
                align="text-start"
                className={styles.paymentRow}
                label={t('bank-account-number')}
                value={ACCOUNT_NUMBER}
                copyPasta={ACCOUNT_NUMBER}
              />
              <OrderRow
                align="text-start"
                className={styles.paymentRow}
                label={t('order-variable-symbol')}
                value={order.variableSymbol}
                copyPasta={order.variableSymbol}
              />
              <MoneyRow
                align="text-start"
                className={styles.paymentRow}
                label={t('order-pay-amount')}
                amount={amount}
                copyPasta={amount}
              />
              <OrderRow
                align="text-start"
                className={styles.paymentRow}
                label={t('bank-account-iban')}
                value={ACCOUNT_IBAN}
                copyPasta={ACCOUNT_IBAN}
              />
              <OrderRow
                align="text-start"
                className={styles.paymentRow}
                label={t('bank-account-bic')}
                value={ACCOUNT_BIC}
                copyPasta={ACCOUNT_BIC}
              />
            </div>
            <hr />
            <div className="d-flex justify-content-center">
              <PaymentQrCode
                amount={amount}
                bic={ACCOUNT_BIC}
                currency={DEFAULT_CURRENCY}
                message={user.email}
                iban={ACCOUNT_IBAN}
                variableSymbol={order.variableSymbol}
              />
            </div>
            <hr />
            <div className="d-flex justify-content-center">
              <InteractiveButton variant="primary" onClick={markAsPaid}>
                {t('order-already-paid')}
              </InteractiveButton>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <p className="fs-3">{t('that-is-great')}</p>
            <p>{t('order-wait-after-payment')}</p>
            <div className="mt-3">
              <InteractiveButton variant="primary" onClick={onHide}>
                {t('that-is-really-awesome')}
              </InteractiveButton>
            </div>
          </Carousel.Item>
        </Carousel>
      </Modal.Body>
    </Modal>
  )
}

const OrderPayControls = ({ order, ...props }) => {
  const [payAs, setPayAs] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const { t } = useTranslation()
  const closeDialog = () => setShowDialog(false)
  const payDeposit = () => {
    setPayAs('deposit')
    setShowDialog(true)
  }
  const paySurcharge = () => {
    setPayAs('surcharge')
    setShowDialog(true)
  }
  const payFull = () => {
    setPayAs('price')
    setShowDialog(true)
  }
  return (
    <div {...props}>
      <OrderPayDialog
        onHide={closeDialog}
        order={order}
        payAs={payAs}
        show={showDialog}
      />
      {order.useDepositPayment && order.status !== ORDER_STATUS_DEPOSIT_PAID && (
        <InteractiveButton
          variant="primary"
          onClick={payDeposit}
          className="m-2"
        >
          {t('order-pay-deposit')}
        </InteractiveButton>
      )}
      {order.status === ORDER_STATUS_DEPOSIT_PAID && (
        <InteractiveButton
          variant="primary"
          onClick={paySurcharge}
          className="m-2"
        >
          {t('order-pay-surcharge')}
        </InteractiveButton>
      )}
      {order.status !== ORDER_STATUS_DEPOSIT_PAID && (
        <InteractiveButton
          className="m-2"
          variant={order.useDepositPayment ? 'secondary' : 'primary'}
          onClick={payFull}
        >
          {t('order-pay-full')}
        </InteractiveButton>
      )}
    </div>
  )
}

const OrderControls = ({ order, ...props }) =>
  CAN_BE_PAID.includes(order.status) && (
    <OrderPayControls order={order} {...props} />
  )

const OrderCancelDialog = ({ error, inProgress, onCancel, onHide, show }) => {
  const { t } = useTranslation()
  return (
    <Modal show={show} onHide={inProgress ? null : onHide}>
      <Modal.Header closeButton={!inProgress}>
        <Modal.Title>{t('order-cancel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('order-cancel-cannot-go-back')}</p>
        <p className="mt-2">{t('order-will-be-refunded')}</p>
        {error && (
          <div className="mt-3">
            <Alert variant="danger">{t('operation-failed')}</Alert>
          </div>
        )}
        <div className="mt-3">
          <InteractiveButton
            inProgress={inProgress}
            onClick={onCancel}
            variant="danger"
          >
            {t('order-cancel')}
          </InteractiveButton>
        </div>
      </Modal.Body>
    </Modal>
  )
}

const OrderCancel = ({ order, onCancel }) => {
  const { t } = useTranslation()
  const [inProgress, setInProgress] = useState(false)
  const [error, setError] = useState(null)
  const [show, setShow] = useState(false)
  const fetch = useFetch()

  const handleCancel = async () => {
    setError(null)
    setInProgress(true)
    try {
      onCancel(await fetch.put(`/orders/${order.id}/cancel`))
      setShow(false)
    } catch (e) {
      setError(e)
    } finally {
      setInProgress(false)
    }
  }

  return (
    order.isCancellable && (
      <>
        <OrderCancelDialog
          error={error}
          inProgress={inProgress}
          onCancel={handleCancel}
          onHide={() => setShow(false)}
          order={order}
          show={show}
        />
        <InteractiveButton
          icon={CancelIcon}
          onClick={() => setShow(true)}
          title={t('order-cancel')}
          variant="link"
        />
      </>
    )
  )
}

export const OrderCard = ({
  order,
  hideStatus,
  onCancel,
  onItemDelete,
  ...props
}) => {
  const { t } = useTranslation()
  return (
    <Section component="article" {...props}>
      {!hideStatus && (
        <header className="d-flex align-items-start justify-content-between">
          <Heading>{order.variableSymbol}</Heading>
          {order.isCancellable && (
            <OrderCancel order={order} onCancel={onCancel} />
          )}
        </header>
      )}
      <OrderItems items={order?.items || []} onDelete={onItemDelete} />
      <Row className="flex-column-reverse flex-md-row">
        <Col md={6} className="mt-1">
          <OrderControls
            className="d-flex flex-row-reverse flex-md-row justify-content-center justify-content-md-start"
            order={order}
          />
        </Col>
        <Col md={6} className="d-flex mt-2">
          <div className="ms-auto me-3">
            {order.useDepositPayment && (
              <>
                <MoneyRow label={t('order-deposit')} amount={order.deposit} />
                <MoneyRow
                  label={t('order-surcharge')}
                  amount={order.price - order.deposit}
                />
              </>
            )}
            <MoneyRow label={t('order-total')} amount={order.price} />
            {!hideStatus && (
              <OrderRow
                label={t('order-status')}
                value={<OrderStatus status={order.status} />}
              />
            )}
          </div>
        </Col>
      </Row>
    </Section>
  )
}

const OrderListEmpty = () => (
  <div className="text-muted mt-3">
    <p>{useTranslation().t('order-list-empty')}</p>
  </div>
)

export const OrderList = ({ orders, onOrderCancel }) => (
  <Section headingLevel={0} className={styles.orderList}>
    <Heading>{useTranslation().t('orders')}</Heading>
    {orders.results.length === 0 ? (
      <OrderListEmpty />
    ) : (
      orders.results.map((order) => (
        <OrderCard key={order.id} order={order} onCancel={onOrderCancel} />
      ))
    )}
  </Section>
)

export const PromotionCodeForm = ({ order, onSubmit }) => {
  const fetch = useFetch()
  const { t } = useTranslation()
  const handleSubmit = async (body) => {
    onSubmit(
      await fetch.post(`/orders/${order.id}/promotion-codes`, {
        body,
      })
    )
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        name="code"
        type="text"
        label={t('order-promotion-code')}
        required
      />
      <FormControls submitLabel={t('order-add-promotion-code')} />
    </Form>
  )
}

const AddAddressForm = () => {
  const { t } = useTranslation()
  const { watch } = useFormContext()
  const addressId = watch('addressId')
  if (addressId) {
    return null
  }
  return (
    <>
      <Input name="title" label={t('address-title')} required />
      <Row>
        <Col>
          <Input name="street" label={t('address-street')} required />
        </Col>
        <Col>
          <StreetNumberInput
            name="street_number"
            label={t('address-street-number')}
            required
          />
        </Col>
      </Row>
      <Row>
        <Input name="country" label={t('address-country')} required />
        <Col>
          <Input name="city" label={t('address-city')} required />
        </Col>
        <Col>
          <PostalCodeInput
            name="postal_code"
            label={t('address-postal-code')}
            required
          />
        </Col>
      </Row>
    </>
  )
}

export const BillingInformation = ({ addresses, onSubmit, order }) => {
  const { t } = useTranslation()
  const fetch = useFetch()
  const defaultValues = {
    addressId: String(order.userInvoiceAddressId) || addresses[0]?.id,
    title: t('user-address-title-home'),
  }
  const selectAddress = async (values) =>
    onSubmit(
      await fetch.patch(`/orders/${order.id}`, {
        body: {
          userInvoiceAddressId: parseInt(values.addressId, 10),
        },
      })
    )

  /*
   * 3. Umoznit pridat adresu
   */
  return (
    <Section className="mt-3">
      <Heading>{t('order-billing-information')}</Heading>
      <Form defaultValues={defaultValues} onSubmit={selectAddress}>
        {addresses.results.map((address) => (
          <Input
            type="radio"
            name="addressId"
            key={address.id}
            label={<Address {...address} />}
            value={String(address.id)}
          />
        ))}
        <Input
          type="radio"
          name="addressId"
          label={t('address-new')}
          value=""
        />
        <AddAddressForm />
        <FormControls submitLabel={t('order-select-address')} />
      </Form>
    </Section>
  )
}

export const PaymentInformation = ({ order, onSubmit }) => {
  const { t } = useTranslation()
  const fetch = useFetch()
  const defaultValues = {
    useDepositPayment: order.useDepositPayment,
  }
  const selectPaymentMethod = async (values) => {
    onSubmit(
      await fetch.patch(`/orders/${order.id}`, {
        body: {
          useDepositPayment: values.useDepositPayment,
        },
      })
    )
  }
  return (
    <Section className="mt-3">
      <Heading>{t('order-payment-information')}</Heading>
      <Form defaultValues={defaultValues} onSubmit={selectPaymentMethod}>
        <Input
          type="checkbox"
          name="useDepositPayment"
          label={t('order-use-deposit-payment')}
        />
        <FormControls submitLabel={t('order-select-payment-method')} />
      </Form>
    </Section>
  )
}
