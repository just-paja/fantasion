const cs = {
  about: {
    source: '/o-nas',
    destination: '/about',
  },
  contacts: {
    source: '/kontakty',
    destination: '/contact',
  },
  faq: {
    source: '/casto-kladene-otazky',
    destination: '/faq',
  },
  home: {
    source: '/',
    destination: '/index',
  },
  adventureList: {
    source: '/dobrodruzstvi',
    destination: '/adventures',
  },
  confirmRegistration: {
    source: '/potvrzeni-registrace',
    destination: '/confirm-registration',
  },
  expeditionDetail: {
    source: '/tabory/:expeditionSlug',
    destination: '/expeditions/:expeditionSlug',
  },
  expeditionBatchDetail: {
    source: '/turnusy/:expeditionBatchSlug',
    destination: '/expedition-batches/:expeditionBatchSlug',
  },
  forgottenPassword: {
    source: '/zapomenute-heslo',
    destination: '/forgotten-password',
  },
  adventureDetail: {
    source: '/dobrodruzstvi/:expeditionThemeSlug',
    destination: '/adventures/:expeditionThemeSlug',
  },
  leisureCentreList: {
    source: '/stredisko',
    destination: '/leisure-centres',
  },
  leisureCentreDetail: {
    source: '/strediska/:leisureCentreSlug',
    destination: '/leisure-centres/:leisureCentreSlug',
  },
  login: {
    source: '/prihlaseni',
    destination: '/login',
  },
  logout: {
    source: '/odhlaseni',
    destination: '/logout',
  },
  profileDetail: {
    source: '/tym/:profileSlug',
    destination: '/team/:profileSlug',
  },
  privacyPolicy: {
    source: '/zasady-ochrany-osobnich-udaju',
    destination: '/privacy-policy',
  },
  register: {
    source: '/registrace',
    destination: '/register',
  },
  team: {
    source: '/tym',
    destination: '/team',
  },
  termsAndConditions: {
    source: '/obchodni-podminky',
    destination: '/terms-and-conditons',
  },
}

const defaultLang = 'cs'

const routes = {
  cs,
}

const getRewrites = () =>
  Object.entries(routes).reduce(
    (aggr, [, paths]) => [...aggr, ...Object.values(paths)],
    []
  )

class MissingParam extends Error {}

const translateRoute = (path, params) =>
  path.replace(/(:[a-zA-Z]+)/g, (match) => {
    const param = match.substring(1)
    const value = params && params[param]
    if (!value) {
      throw new MissingParam(
        `Cannot translate path "${path}" without "${param}"`
      )
    }
    return value
  })

const reverse = (lang, name, params) =>
  `/${lang}${translateRoute(routes[lang || defaultLang][name].source, params)}`

module.exports = { defaultLang, getRewrites, reverse }
