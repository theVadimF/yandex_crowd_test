function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

const init_participants = () => {
  const get_total_pages = () => {
    const page_width = window.innerWidth;
    
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
    let page_count = Math.ceil(el_count / get_total_pages());
    el.querySelector(".counter .total").textContent = page_count;

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
