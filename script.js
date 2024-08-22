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


  document.querySelectorAll(".participants").forEach((el) => {
    const slider_el = el.querySelector(".slider")
    const el_count = slider_el.childElementCount;
    let per_page_amount = get_per_page_amount();
    let page_count = Math.ceil(el_count / per_page_amount);
    el.querySelector(".counter .total").textContent = page_count;

    //TODO(vf) Make it auto scroll

    addEventListener("resize", () => {
      const per_page_updated = get_per_page_amount();
      if (per_page_amount != per_page_updated) {
        per_page_amount = per_page_updated;
        page_count = Math.ceil(el_count / per_page_amount);
        el.querySelector(".counter .total").textContent = page_count;
        // Go to first page if current page is more that total page count after resize
        if (parseInt(slider_el.dataset.current) > page_count) {
          slider_el.dataset.current = 1;
          slider_el.style.transform = `none`;
          el.querySelector(".counter .current").textContent = 1;
        }
      }
    });

    const update_slider_pos = (current_page) => {
      slider_el.dataset.current = current_page;
      slider_el.style.transform = `translateX(calc(-100% * ${current_page - 1})`;
      el.querySelector(".counter .current").textContent = current_page;
    }

    el.querySelector(".page_ctl.__prev").addEventListener("click", () => {
      let current_page = parseInt(slider_el.dataset.current);
      if (current_page > 1) {
        current_page -= 1;
      } else {
        current_page = page_count;
      }
      update_slider_pos(current_page);
    })

    el.querySelector(".page_ctl.__next").addEventListener("click", () => {
      let current_page = parseInt(slider_el.dataset.current);
      if (current_page < page_count) {
        current_page += 1;
      } else {
        current_page = 1;
      }
      update_slider_pos(current_page);
    })
  })
}

const init_transform_stages = () => {
  // TODO(vf) make circles clickable
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
        // cards.classList.add('__no_animate');
        cards.style.transform = 
          `translateX(calc((-100% - 40px)*${cards.dataset.current}))`;
        // cards.classList.remove('__no_animate');
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

    // Prevent firefox from keeping button status after reload
    next_btn.disabled = false;
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
