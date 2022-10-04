export const template: string = `
  <section class="abstract-card">
    <header>
      <a href="{{=url}}">{{=meta.title}}</a>
      {{=meta.authors}}
    </header>
    <aside>
      {{ if (meta.conference) { }}
        <span class="conference">{{=meta.conference}}</span>
      {{ } }}
      <span class="type">
        {{=meta.type}}
        <svg viewBox="0 0 24 24" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          {{ switch (meta.type) {
               case "panel": }}
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
          {{   break;
               case "poster/demo": }}
                <path d="M9 12v-4"></path>
                <path d="M15 12v-2"></path>
                <path d="M12 12v-1"></path>
                <path d="M3 4h18"></path>
                <path d="M4 4v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-10"></path>
                <path d="M12 16v4"></path>
                <path d="M9 20h6"></path>
          {{   break;
               case "paper": }}
                <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                <path d="M7 8h10"></path>
                <path d="M7 12h10"></path>
                <path d="M7 16h10"></path>
          {{ ; } }}
          </svg>
      </span>
    </aside>
    {{ if (filters.keywords) { }}
      <ul>
        {{=filters.keywords.map((keyword) => '<li class="keyword">'+keyword+'</li>').join("")}}
      </ul>
    {{ } }}
    {{ if (typeof excerpt !== "undefined") { }}
      <p>{{=excerpt}}</p>
    {{ } }}
  </section>
`;
