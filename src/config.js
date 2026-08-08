export const config = {
  whatsapp: {
    number: '573176908842',
    get link() {
      return `https://wa.me/${this.number}`
    },
    get defaultMessage() {
      return `${this.link}?text=Hola%2C%20me%20gustar%C3%ADa%20solicitar%20una%20cotizaci%C3%B3n`
    },
  },
  contact: {
    email: 'hola@scorpicore.com',
    phone: '+573176908842',
    phoneHref: 'tel:+573176908842',
  },
  site: {
    name: 'ScorpiCore',
    url: 'https://scorpicore.com',
  },
}
