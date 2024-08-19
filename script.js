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

    addEventListener("resize", () => {
      const per_page_updated = get_per_page_amount();
      if (per_page_amount != per_page_updated) {
        per_page_amount = per_page_updated;
        page_count = Math.ceil(el_count / per_page_amount);
        el.querySelector(".counter .total").textContent = page_count;
        // Go to first page if current page is more that page count after resize
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

ready(() => {
  init_participants();
})
