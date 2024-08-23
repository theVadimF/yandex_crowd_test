function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

const init_participants = () => {
  const get_per_page_amount = () => {
    const page_width = window.innerWidth;
    
    // These values must match the CSS rules
    // TODO(vf): set propper page width values
    if (page_width >= 1200) {
      return 3;
    } else if (page_width >= 700) {
      return 2;
    } else {
      return 1;
    }
  }

  const generate_duplicates = (slider_el, amount) => {
    const elements = slider_el.children;
    const element_count = slider_el.childElementCount;
    let first_elements = [];
    let last_elements = [];

    for (let i = amount - 1; i >= 0; --i) {
      first_elements.push(elements.item(i).cloneNode(true));
    }

    for (let i = element_count - amount; i < element_count; ++i) {
      last_elements.push(elements.item(i).cloneNode(true));
    }

    first_elements.forEach((element) => {
      element.classList.add('__duplicate');
      slider_el.prepend(element);
    })
    last_elements.forEach((element) => {
      element.classList.add('__duplicate');
      slider_el.appendChild(element);
    })
  }

  document.querySelectorAll(".participants").forEach((el) => {
    const slider_el = el.querySelector(".slider")
    const el_count = slider_el.childElementCount;
    const duplicate_amount = 3;
    let per_page_amount = get_per_page_amount();
    // let page_count = Math.ceil(el_count / per_page_amount);
    let btn_lockout = false;
    el.querySelector(".counter .total").textContent = el_count;

    generate_duplicates(slider_el, duplicate_amount);

    slider_el.style.transform =
      `translateX(calc((-100%/${per_page_amount}) *
      ${duplicate_amount})`;

    setTimeout(() => {
      slider_el.classList.remove("__no_animate");
    }, 0)

    //TODO(vf) Make it auto scroll

    addEventListener("resize", () => {
      const per_page_updated = get_per_page_amount();
      const current_page = parseInt(slider_el.dataset.current);
      if (per_page_amount != per_page_updated) {
        per_page_amount = per_page_updated;
        slider_el.classList.add("__no_animate");
        update_slider_pos(current_page);
        setTimeout(() => {
          slider_el.classList.remove("__no_animate");
        }, 0)
      }
    });

    const update_slider_pos = (current_page) => {
      slider_el.dataset.current = current_page;
      slider_el.style.transform =
        `translateX(calc((-100%/${get_per_page_amount()}) *
        ${current_page - 1 + duplicate_amount})`;

      if (current_page < 1) {
        el.querySelector(".counter .current").textContent = el_count + current_page;
      } else if (current_page <= el_count) {
        el.querySelector(".counter .current").textContent = current_page;
      } else {
        el.querySelector(".counter .current").textContent = 1;
      }
    }

    const reset_position = (index) => {
      slider_el.classList.add('__no_animate');
      update_slider_pos(index);
      setTimeout(() => {
        slider_el.classList.remove('__no_animate');
      }, 0)
    }

    el.querySelector(".page_ctl.__prev").addEventListener("click", () => {
      if (!btn_lockout) {
        let curret_page = parseInt(slider_el.dataset.current) - 1;
        update_slider_pos(current_page);
        if (current_page < -per_page_amount + 2) {
          btn_lockout = true;
          slider_el.addEventListener('transitionend', () => {
            reset_position(el_count - per_page_amount + 1);
            btn_lockout = false;
          }, {once: true})
        }
      }
    })

    el.querySelector(".page_ctl.__next").addEventListener("click", () => {
      if (!btn_lockout) {
        let current_page = parseInt(slider_el.dataset.current) + 1;
        update_slider_pos(current_page);
        if (current_page > el_count) {
          btn_lockout = true;
          slider_el.addEventListener('transitionend', () => {
            reset_position(1);
            btn_lockout = false;
          }, {once: true})
        }
      }
    })
  })
}

const init_transform_stages = () => {
  const create_circle = (id, circles, cards, prev_btn, next_btn, amount) => {
    const circle = document.createElement("button");
    circle.classList.add("circle"); 
    circle.dataset.id = id;
    circle.addEventListener("click", (e) => {
      circles.querySelector('.circle.__active').classList.remove('__active');
      e.target.classList.add('__active');
      cards.dataset.current = id;
      if (id <= 0) {
        prev_btn.disabled = true;
        next_btn.disabled = false;
      } else if (id >= amount - 1) {
        prev_btn.disabled = false;
        next_btn.disabled = true;
      } else {
        prev_btn.disabled = false;
        next_btn.disabled = false;
      }
      cards.style.transform = `translateX(calc((-100% - 40px)*${id}))`;
    })
    return circle;
  }

  const generate_dots = (amount, target_el, cards, prev_btn, next_btn) => {
    const circle = create_circle(0, target_el, cards, prev_btn, next_btn, amount);
    circle.classList.add("__active")
    target_el.appendChild(circle);
    for (let i = 1; i < amount; ++i) {
      const circle = create_circle(i, target_el, cards, prev_btn, next_btn, amount);
      target_el.appendChild(circle);
    }
  }

  const set_active_circle = (circles, id) => {
    circles.querySelector('.circle.__active').classList.remove('__active');
    circles.querySelector(`.circle[data-id="${id}"]`).classList.add('__active');
  }

  const check_mobile = (cards) => {
    const is_slider = cards.dataset.isslider;
    if (window.innerWidth < 920) {
      if (is_slider != "1") {
        cards.dataset.isslider = 1;
        cards.classList.add('__no_animate');
        cards.style.transform = 
          `translateX(calc((-100% - 40px)*${cards.dataset.current}))`;
        setTimeout(() => {
          cards.classList.remove("__no_animate");
        }, 0)
      }
    } else if (is_slider != "0") {
      cards.dataset.isslider = 0;
      cards.style.transform = "none";
    }
  }

  document.querySelectorAll(".transform_stages").forEach((el) => {
    const cards = el.querySelector('.cards');
    const card_count = cards.childElementCount;
    const next_btn = el.querySelector(".page_ctl.__next"); 
    const prev_btn = el.querySelector(".page_ctl.__prev"); 
    const circles = el.querySelector(".circles");
    generate_dots(card_count, circles, cards, prev_btn, next_btn);
    check_mobile(cards);

    // Prevent firefox from keeping button state after reload
    // next_btn.disabled = false;
    prev_btn.disabled = true;

    next_btn.addEventListener("click", () => {
      let current = parseInt(cards.dataset.current) + 1;
      if (current >= card_count - 1) {
        next_btn.disabled = true;
      }
      if (current > 0) {
        prev_btn.disabled = false;
      }
      cards.dataset.current = current;
      set_active_circle(circles, current);
      cards.style.transform = `translateX(calc((-100% - 40px)*${current}))`;
    })

    prev_btn.addEventListener("click", () => {
      let current = parseInt(cards.dataset.current) - 1;
      if (current <= 0) {
        prev_btn.disabled = true;
      }
      if (current > 0) {
        next_btn.disabled = false;
      }
      cards.dataset.current = current;
      set_active_circle(circles, current);
      cards.style.transform = `translateX(calc((-100% - 40px)*${current}))`;
    })

    addEventListener("resize", () => {
      check_mobile(cards);
    })

  })
}

ready(() => {
  init_transform_stages();
  init_participants();
})
