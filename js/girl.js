window.ScrubGSAPTimeline = (tl) => {
    let mainTl = new TimelineLite();
    if (Object.prototype.toString.call(tl) === '[object Array]') {
        let i = tl.length;
        while (--i > -1) {
            mainTl.add(tl[i], 0);
        }

    } else {
        mainTl = tl;
    }
    const Scrubber = (_tl) => {

        let mouseMove = (e) => {
                box.innerHTML = parseFloat(_tl.time()).toFixed(2);
                _tl.pause();
                _tl.progress(e.clientX / (window.innerWidth)); // * tl.duration();
                mouseX = e.clientX, mouseY = e.clientY;

                TweenLite.set(box, {
                    x: (mouseX >= (window.innerWidth - 48)) ? mouseX - 48 : mouseX,
                    y: (mouseY <= 20) ? mouseY + 20 : mouseY - 20
                })
            },
            mouseOver = (e) => {
                _tl.pause();
                _tl.play(0);
                TweenLite.set(box, {
                    autoAlpha: 1
                })
            },
            mouseOut = (e) => {
                _tl.play(e.clientX / (window.innerWidth) * _tl.duration());
                TweenLite.set(box, {
                    autoAlpha: 0
                })
            },
            box = document.createElement('div'),
            mouseX, mouseY, gGreen = '#53A018',
            cssText = "position:fixed;border-radius:4px;font-size:14px;padding:5px;user-select:none;pointer-events:none;text-align:center;color:#53A018;top:0;left:0;font-family:Helvetica, Arial, sans-serif;background-color:#262626;line-height:1 !important;z-index:99999999"
        box.style.cssText = cssText;

        document.body.appendChild(box);
        document.body.onmousemove = mouseMove;
        document.body.onmouseover = mouseOver;
        document.body.onmouseout = mouseOut;
        document.body.ondblclick = (e) => {
            if (!document.body.onmousemove) {
                TweenLite.to(box, 0.2, {
                    color: gGreen
                })
                document.body.onmousemove = mouseMove;
                document.body.onmouseover = mouseOver;
                document.body.onmouseout = mouseOut;
                return;
            }

            TweenLite.to(box, 0.2, {
                color: '#A31632'
            })
            document.body.onmousemove = null;
            document.body.onmouseover = null;
            document.body.onmouseout = null;
            _tl.pause();

        }


    }

    Scrubber(mainTl);
}

const meTl = gsap.timeline({
    onComplete: addMouseEvent,
    delay: 2,
  });

  gsap.set('#bg', {transformOrigin: '50% 50%'});
  gsap.set('#ear-right', {transformOrigin: '0% 50%'});
  gsap.set('#ear-left', {transformOrigin: '100% 50%'});
  gsap.set('#me', {opacity: 1});

  meTl
    .from('#me', {duration: 1, yPercent: 100, ease: Elastic.easeOut.config(0.5, 0.4)})
    .from(
      ['#head', '.hair', '.shadow'],
      {duration: 0.9, yPercent: 20, ease: Elastic.easeOut.config(0.58, 0.25)},
      0.1
    )
    .from(
      '#ear-right',
      {duration: 1, rotate: 40, yPercent: 10, ease: Elastic.easeOut.config(0.5, 0.2)},
      0.2
    )
    .from(
      '#ear-left',
      {duration: 1, rotate: -40, yPercent: 10, ease: Elastic.easeOut.config(0.5, 0.2)},
      0.2
    )
    .to(
      '#glasses',
      {
        duration: 1,
        keyframes: [{yPercent: -10}, {yPercent: -0}],
        ease: Elastic.easeOut.config(0.5, 0.2)
      },
      0.25
    )
    .from(
      ['#eyebrow-right', '#eyebrow-left'],
      {duration: 1, yPercent: 300, ease: Elastic.easeOut.config(0.5, 0.2)},
      0.2
    )
    .to(['#eye-right', '#eye-left'], {duration: 0.01, opacity: 1}, 0.35)
    .to(['#eye-right-2', '#eye-left-2'], {duration: 0.01, opacity: 0}, 0.35);
  // end animation

 
  // mouse coords

  let xPosition;
  let yPosition;

  let xPercent;
  let yPercent;

  let height;
  let width;

  function percentage(partialValue, totalValue) {
    return ((100 * partialValue) / totalValue).toFixed(2) * 1;
  }

  function updateWindowSize() {
    height = window.innerHeight;
    width = window.innerWidth;
  }
  updateWindowSize();

  function updateScreenCoords(event) {
    if (event) {
      xPosition = event.clientX;
      yPosition = event.clientY;
    }
  }

  let storedXPosition = 0;
  let storedYPosition = 0;

  function animateFace() {
    if (xPosition) {
      // important, only recalculating if the value changes
      if (storedXPosition != xPosition && storedYPosition != yPosition) {
        console.log(xPosition, yPosition);

        xPercent = percentage(xPosition, width) - 50;
        yPercent = percentage(yPosition, height) - 20;

        yPercentLow = percentage(yPosition, height) - 80;
        yPercentHigh = percentage(yPosition, width) - 50;

        gsap.to('#face', {yPercent: yPercentLow / 30, xPercent: xPercent / 30});
        gsap.to('.eye', {yPercent: yPercent / 3, xPercent: xPercent / 2});
        gsap.to('#inner-face', {yPercent: yPercentHigh / 6, xPercent: xPercent / 8});
        gsap.to('#hair-front', {yPercent: yPercent / 15, xPercent: xPercent / 22});
        gsap.to(['#hair-back', '.shadow'], {
          yPercent: (yPercentLow / 20) * -1,
          xPercent: (xPercent / 20) * -1
        });
        gsap.to('.ear', {
          yPercent: (yPercentHigh / 1.5) * -1,
          xPercent: (xPercent / 10) * -1
        });
        gsap.to(['#eyebrow-left', '#eyebrow-right'], {yPercent: yPercentHigh * 2.5});

        storedXPosition = xPosition;
        storedYPosition = yPosition;
      }
    }
  }

  const blink = gsap.timeline({repeat: -1, repeatDelay: 5, paused: true});

  blink.to(['#eye-right', '#eye-left'], {duration: 0.01, opacity: 0}, 0);
  blink.to(['#eye-right-2', '#eye-left-2'], {duration: 0.01, opacity: 1}, 0);
  blink.to(['#eye-right', '#eye-left'], {duration: 0.01, opacity: 1}, 0.15);
  blink.to(['#eye-right-2', '#eye-left-2'], {duration: 0.01, opacity: 0}, 0.15);

  // function being called at the end of main timeline
  function addMouseEvent() {
    document.addEventListener('mousemove', updateScreenCoords);

    // gsap's RAF, falls back to set timeout
    gsap.ticker.add(animateFace);

    blink.play();
  }

  window.addEventListener('resize', updateWindowSize);