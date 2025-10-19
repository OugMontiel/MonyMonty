<script>
import {useAuth} from "@/features/auth/logic/useAuth.js";
export default {
  name: "Sidebar",
  setup() {
    const {logout} = useAuth();
    return {
      logout,
    };
  },
};
</script>

<template>
  <div class="container">
    <div class="navigation">
      <div class="header">
        <span class="icon">
          <ion-icon name="home-outline"></ion-icon>
        </span>
        <span class="title">Dashboard</span>
      </div>
      <ul>
        <li>
          <a href="#">
            <span class="icon">
              <ion-icon name="people-outline"></ion-icon>
            </span>
            <span class="title">Customers</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="icon">
              <ion-icon name="chatbubble-outline"></ion-icon>
            </span>
            <span class="title">Messages</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="icon">
              <ion-icon name="help-outline"></ion-icon>
            </span>
            <span class="title">Help</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="icon">
              <ion-icon name="settings-outline"></ion-icon>
            </span>
            <span class="title">Settings</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span class="icon">
              <ion-icon name="lock-closed-outline"></ion-icon>
            </span>
            <span class="title">Password</span>
          </a>
        </li>
        <li>
          <a href="#" @click.prevent="logout">
            <span class="icon">
              <ion-icon name="log-out-outline"></ion-icon>
            </span>
            <span class="title">Sign out</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 15%;
}
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 100vh;
  background: var(--color-acento);
  overflow: hidden;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
}

.navigation .header {
  display: flex;
  align-items: center;
  padding: 20px;
  margin-bottom: 20px;
}

.navigation .header .icon {
  font-size: 1.75rem;
  width: 40px;
  text-align: center;
}

.navigation .header .title {
  margin-left: 10px;
  font-size: 18px;
  font-weight: 600;
}

.navigation ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.navigation ul li {
  border-radius: 0 30px 30px 0;
  transition: background 0.3s ease;
}

.navigation ul li:hover,
.navigation ul li.hovered {
  background-color: black;
}

.navigation ul li a {
  display: flex;
  position: relative;
  align-items: center;
  padding: 15px 20px;
  text-decoration: none;
  transition: color 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
}

.navigation ul li:hover a,
.navigation ul li.hovered a {
  color: red;
}

.navigation ul li a .icon {
  font-size: 1.75rem;
  width: 40px;
  text-align: center;
}

.navigation ul li a .title {
  margin-left: 10px;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
}

/* Curvas en hover */
.navigation ul li:hover a::before,
.navigation ul li.hovered a::before,
.navigation ul li:hover a::after,
.navigation ul li.hovered a::after {
  content: "";
  position: absolute;
  right: 0;
  width: 50px;
  height: 50px;
  background: transparent;
  border-radius: 50%;
  pointer-events: none;
}

.navigation ul li:hover a::before,
.navigation ul li.hovered a::before {
  top: -50px;
  box-shadow: 35px 35px 0 10px black;
}

.navigation ul li:hover a::after,
.navigation ul li.hovered a::after {
  bottom: -50px;
  box-shadow: 35px -35px 0 10px black;
}
</style>
