<template>
  <section>
    <main>
      <h1>COVID-19 Statistics</h1>
      <p v-if="error" class="error">An error occured: {{ error }}</p>
      <div>
        <h2 class="subtitle">Total confirmed</h2>
        <h3 class="confirmed">{{ r(stats.cases) }}</h3>
      </div>
      <div>
        <h2>Deaths</h2>
        <h3 class="deaths">{{ r(stats.deaths) }}</h3>
      </div>
      <div>
        <h2>Recovered</h2>
        <h3 class="recovered">{{ r(stats.recovered) }}</h3>
      </div>
      <div>
        <h2>Active</h2>
        <details
          ><summary
            ><h3 class="active">{{ r(stats.active.total) }}</h3></summary
          >
          <div>
            <h3 class="font-normal">Mild</h3>
            <h4 class="mild">{{ r(stats.active.mild) }}</h4>
          </div>
          <div>
            <h3 class="font-normal">Serious</h3>
            <h4 class="serious">{{ r(stats.active.serious) }}</h4>
          </div>
        </details>
      </div>
      <div>
        <h2>Closed</h2>

        <details
          ><summary>
            <h3 class="closed">{{ r(stats.closed.total) }}</h3></summary
          >
          <div>
            <h3 class="font-normal">Deaths</h3>
            <h4 class="mild">{{ r(stats.closed.deaths) }}</h4>
          </div>
          <div>
            <h3 class="font-normal">Recovered</h3>
            <h4 class="serious">{{ r(stats.closed.recovered) }}</h4>
          </div>
        </details>
      </div>
    </main>
    <footer>
      <div>
        <p>Data by <a href="https://www.worldometers.info/coronavirus/">worldometers</a>.</p>
        <p v-if="!error && !loading">
          Last update: {{ new Date(stats.lastUpdate).toLocaleString().slice(0, -3) }} (local time).
        </p>
      </div>
      <p>
        Next update in
        <span class="countdown" @click="forceRefresh">{{ minutes }}m:{{ seconds }}s</span>
      </p>
    </footer>
  </section>
</template>

<script>
export default {
  data() {
    return {
      stats: {
        cases: 'loading...',
        deaths: 'loading...',
        recovered: 'loading...',
        active: {
          total: 'loading...',
          mild: 'loading...',
          serious: 'loading...',
        },
        closed: {
          total: 'loading...',
          recovered: 'loading...',
          deaths: 'loading...',
        },
        lastUpdate: 'loading...',
      },
      countdown: {
        time: 300,
        timer: null,
      },
      error: null,
      loading: true,
    };
  },
  methods: {
    async getInfo() {
      try {
        const stats = await fetch('https://covid19-statistics-backend.herokuapp.com/');
        const data = await stats.json();
        this.stats = data;
        this.loading = false;
        this.error = null;
      } catch (error) {
        this.stats = {
          cases: '——————',
          deaths: '——————',
          recovered: '——————',
          active: {
            total: '——————',
            mild: '——————',
            serious: '——————',
          },
          closed: {
            total: '——————',
            recovered: '——————',
            deaths: '——————',
          },
          lastUpdate: null,
        };
        this.error = error.message;
      }
    },
    startTimer() {
      if (this.countdown.time > 0) {
        this.countdown.time -= 1;
        return;
      }
      clearInterval(this.countdown.timer);
      this.getInfo();
      this.countdown.time = 300;
      this.countdown.timer = setInterval(this.startTimer, 1000);
    },
    forceRefresh() {
      clearInterval(this.countdown.timer);
      this.error = null;
      this.getInfo();
      this.countdown.time = 300;
      this.countdown.timer = setInterval(this.startTimer, 1000);
    },
    r(number) {
      return number.toLocaleString();
    },
  },
  computed: {
    minutes() {
      return String(Math.floor(this.countdown.time / 60)).padStart(2, '0');
    },
    seconds() {
      return String(this.countdown.time % 60).padStart(2, '0');
    },
  },
  created() {
    this.getInfo();
    this.countdown.timer = setInterval(this.startTimer, 1000);
  },
};
</script>

<style>
main > * + * {
  margin-top: 1.5rem;
}
main {
  margin-left: 40px;
}
.font-normal {
  font-weight: 400;
}
h1 {
  font-size: 3rem;
}
.subtitle {
  font-size: 2rem;
}
h2 {
  font-size: 1.8rem;
  margin-bottom: 0.4em;
  font-weight: 400;
}
h3 {
  font-size: 1.6rem;
  margin: 0;
}
h4 {
  font-size: 1.4rem;
  margin: 0.7em 0;
}
.confirmed {
  color: hsl(0, 0%, 90%);
}
.deaths {
  color: hsl(0, 100%, 70%);
}
.recovered {
  color: hsl(145, 100%, 70%);
}
.active {
  color: hsl(200, 100%, 70%);
}
.active,
.closed {
  display: inline-block;
  margin-bottom: 0.5em;
}
.mild {
  color: hsl(61, 100%, 80%);
  margin-top: 0.3em;
}
.serious {
  color: hsl(0, 100%, 62%);
  margin-top: 0.3em;
}
details {
  cursor: pointer;
}
details > div {
  margin-left: 1.2em;
}
footer {
  position: fixed;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30px 0;
  background: hsl(0, 0%, 85%);
  color: hsl(0, 57%, 9%);
}
@media (max-width: 500px) {
  footer {
    flex-direction: column;
    padding: 10px 0;
  }
  footer p {
    margin: 12px 0;
  }
  main {
    margin-left: 20px;
  }
  h1 {
    margin: 0;
  }
}
a {
  color: hsl(200, 90%, 40%);
}
.countdown {
  font-weight: 700;
  cursor: pointer;
  position: relative;
}
.countdown::before {
  content: '';
  opacity: 0;
}
.countdown:hover::before {
  content: 'click to refresh';
  position: absolute;
  display: inline-block;
  color: hsl(200, 16%, 85%);
  background: hsl(0, 24%, 23%);
  border-radius: 2px;
  font-size: 0.6rem;
  width: 18ch;
  text-align: center;
  padding: 5px 2ch;
  top: -30px;
  left: -28px;
  opacity: 1;
}
.error {
  width: fit-content;
  background: hsl(0, 100%, 30%);
  padding: 20px 15px;
  border-radius: 4px;
}
</style>
