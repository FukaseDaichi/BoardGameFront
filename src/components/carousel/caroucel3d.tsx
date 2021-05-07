import styles from "../../styles/components/caroucel/caroucel3d.module.scss";
import { useEffect } from "react";

export default function caroucel3d() {
	useEffect(() => {
		var radius = 240; // how big of the radius
		var autoRotate = true; // auto rotate or not
		var rotateSpeed = -60; // unit: seconds/360 degrees
		var imgWidth = 120; // width of images (unit: px)
		var imgHeight = 170; // height of images (unit: px)

		var bgMusicControls = true; // Show UI music control

		// ===================== start =======================
		// animation start after 1000 miliseconds
		setTimeout(init, 1000);

		var odrag: any = document.getElementById(styles["drag-container"]);
		var ospin = document.getElementById(styles["spin-container"]);
		var aImg: any = ospin.getElementsByTagName("img");
		var aVid: any = ospin.getElementsByTagName("video");
		var aEle = [...aImg, ...aVid]; // combine 2 arrays

		// Size of images
		ospin.style.width = imgWidth + "px";
		ospin.style.height = imgHeight + "px";

		// Size of ground - depend on radius
		var ground = document.getElementById(styles["ground"]);
		ground.style.width = radius * 3 + "px";
		ground.style.height = radius * 3 + "px";

		function init(delayTime) {
			for (var i = 0; i < aEle.length; i++) {
				aEle[i].style.transform =
					"rotateY(" +
					i * (360 / aEle.length) +
					"deg) translateZ(" +
					radius +
					"px)";
				aEle[i].style.transition = "transform 1s";
				aEle[i].style.transitionDelay =
					delayTime || (aEle.length - i) / 4 + "s";
			}
		}

		function applyTranform(obj) {
			// Constrain the angle of camera (between 0 and 180)
			if (tY > 180) tY = 180;
			if (tY < 0) tY = 0;

			// Apply the angle
			obj.style.transform = "rotateX(" + -tY + "deg) rotateY(" + tX + "deg)";
		}

		function playSpin(yes) {
			ospin.style.animationPlayState = yes ? "running" : "paused";
		}

		var sX,
			sY,
			nX,
			nY,
			desX = 0,
			desY = 0,
			tX = 0,
			tY = 10;

		// auto spin
		if (autoRotate) {
			var animationName = rotateSpeed > 0 ? "spin" : "spinRevert";
			ospin.style.animation = `${animationName} ${Math.abs(
				rotateSpeed
			)}s infinite linear`;
		}

		// setup events
		document.onpointerdown = function (e: any) {
			clearInterval(odrag.timer);
			e = e || window.event;
			var sX = e.clientX,
				sY = e.clientY;

			this.onpointermove = function (e: any) {
				e = e || window.event;
				var nX = e.clientX,
					nY = e.clientY;
				desX = nX - sX;
				desY = nY - sY;
				tX += desX * 0.1;
				tY += desY * 0.1;
				applyTranform(odrag);
				sX = nX;
				sY = nY;
			};

			this.onpointerup = function (e) {
				odrag.timer = setInterval(function () {
					desX *= 0.95;
					desY *= 0.95;
					tX += desX * 0.1;
					tY += desY * 0.1;
					applyTranform(odrag);
					playSpin(false);
					if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
						clearInterval(odrag.timer);
						playSpin(true);
					}
				}, 17);
				this.onpointermove = this.onpointerup = null;
			};

			return false;
		};
	}, []);

	return (
		<>
			<div id={styles["drag-container"]}>
				<div id={styles["spin-container"]}>
					<img
						src="https://images.pexels.com/photos/206395/pexels-photo-206395.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
						alt=""
					/>
					<img
						src="https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
						alt=""
					/>
					<img
						src="https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
						alt=""
					/>
					<img
						src="https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
						alt=""
					/>
					<img
						src="https://images.pexels.com/photos/1382734/pexels-photo-1382734.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
						alt=""
					/>
					<img
						src="https://images.pexels.com/photos/1462636/pexels-photo-1462636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
						alt=""
					/>

					<p>3D Tiktok Carousel</p>
				</div>
				<div id={styles["ground"]}></div>
			</div>
			<div id={styles["music-container"]}></div>
		</>
	);
}
