/**
 * Accordion class
 * @param {HTMLElement} element Accordion section element
 */
const Accordion = class {
  constructor(element) {
    this.copyLinkButton = element.querySelector('.accordion-section__copy-link-button')
    this.element = element
    this.id = element.getAttribute('id')
    this.globalExpand = document.querySelector('.global-accordion-expand-all')
    this.globalCollapse = document.querySelector('.global-accordion-collapse-all')
  }

  /**
   * @return {NodeList} All of this accordion's parent accordions, if accordion is nested
   */
  get parentAccordions() {
    const accordions = document.querySelectorAll('.accordion-section')
    return Array.from(accordions).filter(
      (el) => el.contains(this.element) && el != this.element
    )
  }

  static globalExpand = document.querySelector('.global-accordion-expand-all')
  static globalCollapse = document.querySelector('.global-accordion-collapse-all')
  static elements = document.querySelectorAll('.accordion-section')

  static setGlobalControls() {
    if (Accordion.elements.length === 0) return
    if (!Accordion.globalCollapse || !Accordion.globalExpand) return;
    const closedCount = Array.from(Accordion.elements).filter((element => element.getAttribute('open') === null)).length
    if (closedCount !== 0 && closedCount < Accordion.elements.length) {
      Accordion.globalCollapse.classList.remove('visually-hidden')
      Accordion.globalExpand.classList.remove('visually-hidden')
    }
    if (closedCount === Accordion.elements.length) {
      Accordion.globalExpand.classList.remove('visually-hidden')
      Accordion.globalCollapse.classList.add('visually-hidden')
    }
    if (closedCount === 0 && Accordion.elements.length > 0) {
      Accordion.globalExpand.classList.add('visually-hidden')
      Accordion.globalCollapse.classList.remove('visually-hidden')
    }
  }

  /**
   * Set initial UI state on page load and initialize accordions
   */
  static setup() {
    Accordion.elements.forEach((element) => {
      const accordion = new Accordion(element)
      accordion.init()
    })
    Accordion.setGlobalControls()
  }

  /**
   * Adds event listeners for:
   * - copy to clipboard
   * - global expand/collapse
   */
  addEventListeners() {
    this.copyLinkButton.addEventListener('click', this.copyLink.bind(this))
    this.element.addEventListener('toggle', Accordion.setGlobalControls.bind(this))

    if (Accordion.globalExpand) {
      Accordion.globalExpand.addEventListener('click', this.open.bind(this))
    }
    if (Accordion.globalCollapse) {
      Accordion.globalCollapse.addEventListener('click', this.close.bind(this))
    }
  }

  /**
   * Collapse accordion
   */
  close() {
    this.element.removeAttribute('open')
    Accordion.setGlobalControls()
  }

  /**
   * Copy link to heading to clipboard
   * Push url to window.history
   */
  copyLink() {
    if (this.copying) return;
    this.copying = true;
    const href = this.copyLinkButton.getAttribute('value')
    const { origin, pathname } = window.location
    this.copyLinkButton.classList.add('accordion-tooltip--active');
    try {
      const url = new URL(pathname + href, origin)
      navigator.clipboard.writeText(url)
      window.history.pushState({}, '', url)
      setTimeout(() => {
        this.copyLinkButton.classList.remove('accordion-tooltip--active');
        this.copying = false;
      }, 2000);
    } catch (error) {
      console.error(`Error copying heading link: `, error)
    }
  }

  /**
   * Add event listeners and set initial state
   */
  init() {
    this.addEventListeners()
    this.setStateFromUrl()
  }

  /**
   * Expand accordion
   */
  open() {
    this.element.setAttribute('open', true)
    Accordion.setGlobalControls()
  }

  /**
   * Sets the the initial accordion state if url contains a hash to an accordion id
   * Expands parent accordions if selected accordion is nested
   */
  setStateFromUrl() {
    const hashId = window.location.hash.replace(/^#/, '')
    if (hashId === this.id) {
      this.open()
      if (this.parentAccordions && this.parentAccordions.length) {
        this.parentAccordions.forEach((el) => el.setAttribute('open', true))
      }
    }
  }
}

export default Accordion