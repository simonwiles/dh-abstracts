<script lang="ts">
  interface Icon {
    svg: string;
    attribs?: any;
  }

  export let name;
  export let width = "1rem";
  export let height = "1rem";
  export let customAttribs = {};

  const defaultAttribs = {
    viewBox: "0 0 24 24",
    "stroke-width": 2,
    stroke: "currentColor",
    fill: "none",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
  };

  const icons: { [key: string]: Icon } = {
    "poster/demo": {
      svg: `
      <path d="M9 12v-4"></path>
      <path d="M15 12v-2"></path>
      <path d="M12 12v-1"></path>
      <path d="M3 4h18"></path>
      <path d="M4 4v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-10"></path>
      <path d="M12 16v4"></path>
      <path d="M9 20h6"></path>
    `,
    },
    paper: {
      svg: `
      <rect x="3" y="4" width="18" height="16" rx="2"></rect>
      <path d="M7 8h10"></path>
      <path d="M7 12h10"></path>
      <path d="M7 16h10"></path>
    `,
    },
    panel: {
      svg: `
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
    `,
    },
  };

  const { attribs, svg } = icons[name];
</script>

<svg
  {height}
  {width}
  {...defaultAttribs}
  {...attribs}
  {...customAttribs}
  {...$$props}>{@html svg}</svg
>

<style>
  :where(svg) {
    display: inline-block;
    fill: transparent;
    height: 1.5rem;
    stroke: currentColor;
    vertical-align: middle;
    width: 1.5rem;
  }
</style>
