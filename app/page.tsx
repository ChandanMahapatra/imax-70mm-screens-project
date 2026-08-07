"use client";

import { PersonStanding } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type Screen = {
  id: string;
  country: string;
  region: string;
  city: string;
  name: string;
  width: number;
  height: number;
  source?: string;
};

/*
 * ANIMATION STORYBOARD
 *
 *    0ms   selected screen mounts at 94% scale and transparent
 * 1100ms   screen reaches its measured size and full opacity
 * 1100ms   annotation and legend color settle with the screen
 */
const TIMING = {
  screenTransition: 500,
};

const SCREEN_COLORS = ["#5f84ff", "#55e4db", "#c7ff4a", "#ff6f91", "#ff9f43"];
const MAX_SELECTIONS = 5;
const MAX_W = 32;
const MAX_H = 30;
const X_TICKS = [0, 8, 16, 24, 32];
const Y_TICKS = [0, 5, 10, 15, 20, 25, 30];
const IMAX_LIST = "https://www.imax.com/movie/the-odyssey";
const LF_SOURCE = "https://lfexaminer.com/theaters/";

const screens: Screen[] = [
  { id: "melbourne", country: "Australia", region: "Victoria", city: "Melbourne", name: "IMAX Melbourne", width: 32, height: 23, source: "https://imaxmelbourne.com.au/about_imax/the_imax_difference/" },
  { id: "brussels", country: "Belgium", region: "Brussels-Capital", city: "Brussels", name: "Kinepolis Brussels", width: 27.6, height: 19.3, source: "https://kinepolis.com/BE_NL/bioscopen/kinepolis-brussel/info/" },
  { id: "calgary", country: "Canada", region: "Alberta", city: "Calgary", name: "Scotiabank Chinook & IMAX", width: 21.3, height: 16.2 },
  { id: "edmonton", country: "Canada", region: "Alberta", city: "Edmonton", name: "Scotiabank Edmonton & IMAX", width: 21.3, height: 16 },
  { id: "langley", country: "Canada", region: "British Columbia", city: "Langley", name: "Cineplex Cinemas Langley & IMAX", width: 21.3, height: 16 },
  { id: "richmond", country: "Canada", region: "British Columbia", city: "Richmond", name: "SilverCity Riverport & IMAX", width: 21.3, height: 16.1 },
  { id: "halifax", country: "Canada", region: "Nova Scotia", city: "Halifax", name: "Scotiabank Theatre Halifax & IMAX", width: 21.8, height: 16.1 },
  { id: "mississauga", country: "Canada", region: "Ontario", city: "Mississauga", name: "Cineplex Cinemas Mississauga & IMAX", width: 21.5, height: 16.1 },
  { id: "vaughan", country: "Canada", region: "Ontario", city: "Vaughan", name: "Cineplex Cinemas Vaughan & IMAX", width: 21.8, height: 16.1 },
  { id: "montreal", country: "Canada", region: "Québec", city: "Montréal", name: "Cinema Banque Scotia Montreal & IMAX", width: 24.9, height: 18.7 },
  { id: "regina", country: "Canada", region: "Saskatchewan", city: "Regina", name: "Kramer IMAX Theatre", width: 22.25, height: 15.85, source: "https://www.sasksciencecentre.com/ssc-revitalization" },
  { id: "prague", country: "Czech Republic", region: "Prague", city: "Prague", name: "Cinema City IMAX Prague", width: 25, height: 20, source: "https://www.cinemacity.cz/imax" },
  { id: "montpellier", country: "France", region: "Occitanie", city: "Montpellier", name: "Pathé Odysseum", width: 22.39, height: 16.75, source: "https://www.linternaute.com/cinema/magazine/10724892-imax-70mm-odysseum/" },
  { id: "bfi", country: "United Kingdom", region: "England", city: "London", name: "BFI IMAX", width: 26, height: 20, source: "https://www.bfi.org.uk/venue-hire/hiring-bfi-imax" },
  { id: "science-museum", country: "United Kingdom", region: "England", city: "London", name: "Science Museum IMAX: The Ronson Theatre", width: 24.3, height: 17.7 },
  { id: "printworks", country: "United Kingdom", region: "England", city: "Manchester", name: "Vue Manchester Printworks", width: 26.3, height: 18.8 },
  { id: "tempe", country: "United States", region: "Arizona", city: "Tempe", name: "Harkins Arizona Mills & IMAX", width: 24.4, height: 18.3 },
  { id: "dublin", country: "United States", region: "California", city: "Dublin", name: "Regal Hacienda Crossings & IMAX", width: 23.3, height: 17 },
  { id: "hollywood", country: "United States", region: "California", city: "Hollywood", name: "TCL Chinese Theatres IMAX", width: 28.7, height: 14 },
  { id: "irvine", country: "United States", region: "California", city: "Irvine", name: "Regal Irvine Spectrum & IMAX", width: 26.8, height: 20.6 },
  { id: "la-live", country: "United States", region: "California", city: "Los Angeles", name: "Regal LA Live & IMAX", width: 26.58, height: 13.47, source: "https://losangelestheatres.blogspot.com/2018/10/regal-cinemas.html" },
  { id: "ontario", country: "United States", region: "California", city: "Ontario", name: "Regal Edwards Ontario Palace & IMAX", width: 27.1, height: 20.4 },
  { id: "sacramento", country: "United States", region: "California", city: "Sacramento", name: "Esquire IMAX Theatre", width: 23.1, height: 18 },
  { id: "metreon", country: "United States", region: "California", city: "San Francisco", name: "AMC Metreon 16 & IMAX", width: 29.8, height: 23 },
  { id: "citywalk", country: "United States", region: "California", city: "Universal City", name: "Universal Cinema AMC at CityWalk & IMAX", width: 24.1, height: 17.7 },
  { id: "colorado-springs", country: "United States", region: "Colorado", city: "Colorado Springs", name: "Cinemark Carefree Circle & IMAX", width: 21.3, height: 16.1 },
  { id: "denver", country: "United States", region: "Colorado", city: "Denver", name: "Regal Colorado Center 9 & IMAX", width: 21.6, height: 12.8 },
  { id: "fort-lauderdale", country: "United States", region: "Florida", city: "Fort Lauderdale", name: "AutoNation IMAX, Museum of Discovery & Science", width: 24.4, height: 18.3 },
  { id: "buford", country: "United States", region: "Georgia", city: "Buford", name: "Regal Mall of Georgia & IMAX", width: 24.8, height: 18.1 },
  { id: "woodridge", country: "United States", region: "Illinois", city: "Woodridge", name: "Cinemark Seven Bridges & IMAX", width: 21.3, height: 15.2 },
  { id: "indianapolis", country: "United States", region: "Indiana", city: "Indianapolis", name: "IMAX, Indiana State Museum", width: 25.6, height: 19.2 },
  { id: "grand-rapids", country: "United States", region: "Michigan", city: "Grand Rapids", name: "Celebration! Cinema Grand Rapids North & IMAX", width: 21.3, height: 16.1 },
  { id: "las-vegas", country: "United States", region: "Nevada", city: "Las Vegas", name: "Brenden Palms 14 & IMAX", width: 17.1, height: 12.5 },
  { id: "lincoln", country: "United States", region: "New York", city: "New York", name: "AMC Lincoln Square 13 & IMAX", width: 30.78, height: 23.04, source: "https://www.timeout.com/newyork/movie-theaters/amc-loews-lincoln-square-13" },
  { id: "rochester", country: "United States", region: "New York", city: "Rochester", name: "Cinemark Tinseltown Rochester & IMAX", width: 21.3, height: 16.1 },
  { id: "king-of-prussia", country: "United States", region: "Pennsylvania", city: "King of Prussia", name: "Regal UA King of Prussia & IMAX", width: 22.3, height: 15.9 },
  { id: "providence", country: "United States", region: "Rhode Island", city: "Providence", name: "Apple Cinemas Providence Place & IMAX", width: 24.7, height: 18.6 },
  { id: "chattanooga", country: "United States", region: "Tennessee", city: "Chattanooga", name: "IMAX, Tennessee Aquarium", width: 27.13, height: 20.12, source: "https://tnaqua.org/at-the-aquarium/everything-old-is-new-again/" },
  { id: "nashville", country: "United States", region: "Tennessee", city: "Nashville", name: "Regal Opry Mills & IMAX", width: 27.4, height: 20 },
  { id: "dallas", country: "United States", region: "Texas", city: "Dallas", name: "Cinemark Dallas & IMAX", width: 21.6, height: 16.1 },
  { id: "san-antonio", country: "United States", region: "Texas", city: "San Antonio", name: "AMC Rivercenter 11 & IMAX", width: 21.3, height: 16.1 },
];

function formatMetres(metres: number) {
  return Number.isInteger(metres * 10) ? metres.toFixed(1) : metres.toFixed(2);
}

function useDismiss(
  isOpen: boolean,
  setOpen: (value: boolean) => void,
  ref: React.RefObject<HTMLDivElement | null>,
  triggerRef: React.RefObject<HTMLButtonElement | null>,
) {
  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, setOpen, ref, triggerRef]);
}

export default function Home() {
  const countries = useMemo(
    () => Array.from(new Set(screens.map((screen) => screen.country))),
    [],
  );
  const [country, setCountry] = useState("United States");
  const [selectedIds, setSelectedIds] = useState([
    "hollywood",
    "irvine",
    "la-live",
    "ontario",
    "citywalk",
  ]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [screensOpen, setScreensOpen] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);
  const screensRef = useRef<HTMLDivElement>(null);
  const countryTriggerRef = useRef<HTMLButtonElement>(null);
  const screensTriggerRef = useRef<HTMLButtonElement>(null);

  useDismiss(countryOpen, setCountryOpen, countryRef, countryTriggerRef);
  useDismiss(screensOpen, setScreensOpen, screensRef, screensTriggerRef);

  const countryScreens = screens.filter((screen) => screen.country === country);
  const selected = selectedIds
    .map((id) => screens.find((screen) => screen.id === id))
    .filter((screen): screen is Screen => Boolean(screen));
  const smallestSelectedArea = selected.length
    ? Math.min(...selected.map((screen) => screen.width * screen.height))
    : 0;
  const shortestSelectedHeight = selected.length
    ? Math.min(...selected.map((screen) => screen.height))
    : 0;
  const tallestSelectedHeight = selected.length
    ? Math.max(...selected.map((screen) => screen.height))
    : 0;
  const heightDifference = tallestSelectedHeight - shortestSelectedHeight;
  const screensByArea = [...selected].sort(
    (a, b) => b.width * b.height - a.width * a.height,
  );
  const groups = countryScreens.reduce<Record<string, Screen[]>>((acc, screen) => {
    (acc[screen.region] ??= []).push(screen);
    return acc;
  }, {});

  function toggleScreen(id: string) {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= MAX_SELECTIONS) return current;
      return [...current, id];
    });
  }

  return (
    <main style={{ "--screen-duration": `${TIMING.screenTransition}ms` } as React.CSSProperties}>
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="IMAX 70mm Screens home">
          IMAX 70<span>mm Screens</span>
        </a>
        <a className="source-link" href={IMAX_LIST} target="_blank" rel="noreferrer">
          <span className="source-prefix">Official&nbsp;</span>IMAX theatre list ↗
        </a>
      </header>

      <section className="hero" id="top">
        <div>
          <h1>IMAX <span>70mm</span> Screens</h1>
          <p className="intro">
            Compare up to five physical screen sizes from every theatre on the
            current Odyssey IMAX 70mm list.
          </p>
        </div>

        <div className="controls" aria-label="Choose theatres to compare">
          <div className="picker" ref={countryRef}>
            <span className="control-label">01 / Country</span>
            <button
              className="picker-trigger"
              type="button"
              aria-expanded={countryOpen}
              aria-controls="country-menu"
              onClick={() => setCountryOpen((open) => !open)}
              ref={countryTriggerRef}
              data-testid="country-trigger"
            >
              <span>{country}</span>
              <i aria-hidden="true" />
            </button>
            {countryOpen && (
              <div className="picker-menu country-menu" id="country-menu" aria-label="Country">
                {countries.map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={country === item}
                    className={country === item ? "active" : ""}
                    onClick={() => {
                      setCountry(item);
                      setCountryOpen(false);
                      countryTriggerRef.current?.focus();
                    }}
                  >
                    <span>{item}</span>
                    <small>{screens.filter((screen) => screen.country === item).length}</small>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="picker" ref={screensRef}>
            <span className="control-label">02 / Screens</span>
            <button
              className="picker-trigger"
              type="button"
              aria-expanded={screensOpen}
              aria-controls="screen-menu"
              onClick={() => setScreensOpen((open) => !open)}
              ref={screensTriggerRef}
              data-testid="screens-trigger"
            >
              <span>{selected.length} of {MAX_SELECTIONS} selected</span>
              <i aria-hidden="true" />
            </button>
            {screensOpen && (
              <div className="picker-menu screen-menu" id="screen-menu" aria-label={`Screens in ${country}`}>
                <div className="menu-head">
                  <b>{country}</b>
                  <span>{countryScreens.length} locations · choose up to {MAX_SELECTIONS}</span>
                </div>
                <div className="menu-scroll">
                  {Object.entries(groups).map(([region, items]) => (
                    <div className="region-group" key={region}>
                      <h3>{region}</h3>
                      {items.map((screen) => {
                        const checked = selectedIds.includes(screen.id);
                        const disabled = !checked && selected.length >= MAX_SELECTIONS;
                        return (
                          <label
                            className={disabled ? "screen-option disabled" : "screen-option"}
                            key={screen.id}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={disabled}
                              onChange={() => toggleScreen(screen.id)}
                              data-testid={`screen-option-${screen.id}`}
                            />
                            <span className="check" aria-hidden="true" />
                            <span className="option-copy">
                              <b>{screen.city}</b>
                              <small>{screen.name}</small>
                            </span>
                            <span className="option-size">{screen.width} × {screen.height} m</span>
                          </label>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="menu-foot">
                  <span>{selected.length === MAX_SELECTIONS ? "Maximum reached" : `${MAX_SELECTIONS - selected.length} slots remaining`}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setScreensOpen(false);
                      screensTriggerRef.current?.focus();
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="stage" aria-live="polite">
        <div className="stage-head">
          <div>
            <span className="index">Overlay comparison</span>
            <h2>{selected.length ? `${selected.length} screens · true physical scale` : "Choose a screen to begin"}</h2>
            {selected.length > 1 && (
              <p className="height-summary">
                Height range
                <strong>{formatMetres(shortestSelectedHeight)}–{formatMetres(tallestSelectedHeight)} m</strong>
                <span>{formatMetres(heightDifference)} m difference</span>
              </p>
            )}
          </div>
          <button
            className="clear-button"
            type="button"
            onClick={() => setSelectedIds([])}
            disabled={!selected.length}
          >
            Clear all
          </button>
        </div>

        <div className="chart">
          <div className="scale-frame">
            <div className="y-axis" aria-hidden="true">
              {Y_TICKS.map((tick) => (
                <span key={tick} style={{ bottom: `${(tick / MAX_H) * 100}%` }}>{tick}m</span>
              ))}
            </div>
            <div className="plot">
              <div className="gridlines" aria-hidden="true">
                {Y_TICKS.map((tick) => (
                  <i key={tick} style={{ bottom: `${(tick / MAX_H) * 100}%` }} />
                ))}
              </div>

              {screensByArea.map((screen, stackIndex) => {
                const index = selected.findIndex((item) => item.id === screen.id);
                const color = SCREEN_COLORS[index];
                return (
                  <div
                    className="screen"
                    key={screen.id}
                    style={{
                      "--screen-color": color,
                      "--measure-lane": `${index * 9}px`,
                      "--height-measure-lane": `${index * 26}px`,
                      width: `${(screen.width / MAX_W) * 100}%`,
                      height: `${(screen.height / MAX_H) * 100}%`,
                      zIndex: stackIndex + 1,
                    } as React.CSSProperties}
                    data-testid={`overlay-${screen.id}`}
                  >
                    <div className="screen-measure screen-measure-width" aria-hidden="true">
                      <span>{formatMetres(screen.width)} m</span>
                    </div>
                    <div className="screen-measure screen-measure-height" aria-hidden="true">
                      <span>{formatMetres(screen.height)} m</span>
                    </div>
                  </div>
                );
              })}

              <div className="height-guides" aria-hidden="true">
                {selected.map((screen, index) => {
                  const difference = screen.height - shortestSelectedHeight;
                  return (
                    <div
                      className="height-guide"
                      key={screen.id}
                      style={{
                        "--screen-color": SCREEN_COLORS[index],
                        "--guide-lane": `${index * 22}px`,
                        bottom: `${(screen.height / MAX_H) * 100}%`,
                        left: `${50 + (screen.width / MAX_W) * 50}%`,
                      } as React.CSSProperties}
                    >
                      <span>
                        <b>{formatMetres(screen.height)} m</b>
                        <em>
                          {difference > 0 ? ` · +${formatMetres(difference)} m` : " · baseline"}
                        </em>
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="plot-labels">
                {selected.map((screen, index) => {
                  const area = screen.width * screen.height;
                  const areaDifference = smallestSelectedArea
                    ? Math.round((area / smallestSelectedArea - 1) * 100)
                    : 0;
                  return (
                    <div
                      className="screen-label"
                      key={screen.id}
                      style={{
                        "--screen-color": SCREEN_COLORS[index],
                        "--label-offset": `${index * 38}px`,
                      } as React.CSSProperties}
                    >
                      <b>{screen.city}</b>
                      <strong>{(screen.width / screen.height).toFixed(2)}:1</strong>
                      <span>{formatMetres(screen.width)} × {formatMetres(screen.height)} m</span>
                      <em>
                        {Math.round(area)} m²
                        {areaDifference > 0 ? ` · +${areaDifference}% area` : " · smallest"}
                      </em>
                    </div>
                  );
                })}
              </div>

              <div className="human-scale" aria-label="Human figure representing 1.8 metres">
                <span className="human-label">1.8 m</span>
                <PersonStanding className="human-icon" strokeWidth={2.2} aria-hidden="true" />
              </div>
            </div>
            <div className="x-axis" aria-hidden="true">
              {X_TICKS.map((tick) => (
                <span key={tick} style={{ left: `${(tick / MAX_W) * 100}%` }}>{tick}m</span>
              ))}
            </div>
          </div>
        </div>

        <div className="legend">
          {selected.length ? selected.map((screen, index) => (
            <article key={screen.id}>
              <span className="legend-swatch" style={{ background: SCREEN_COLORS[index] }} />
              <div>
                <b>{screen.name}</b>
                <small>{screen.city}, {screen.country}</small>
              </div>
              <strong>
                {formatMetres(screen.width)} × {formatMetres(screen.height)} m
                {" · "}
                {Math.round(screen.width * screen.height)} m²
              </strong>
              <a href={screen.source ?? LF_SOURCE} target="_blank" rel="noreferrer" aria-label={`Source for ${screen.name}`}>↗</a>
              <button type="button" onClick={() => toggleScreen(screen.id)} aria-label={`Remove ${screen.name}`}>×</button>
            </article>
          )) : (
            <div className="empty-state">Open “Screens” above to add a theatre.</div>
          )}
        </div>
      </section>

      <footer>
        <p>
          All {screens.length} locations are from the current{" "}
          <a href={IMAX_LIST} target="_blank" rel="noreferrer">official IMAX list</a>.
          Dimensions use venue-published figures where available and{" "}
          <a href={LF_SOURCE} target="_blank" rel="noreferrer">LF Examiner’s theatre database</a>{" "}
          for the remaining physical screen envelopes.
        </p>
        <span>Checked 23 Jul 2026</span>
      </footer>
    </main>
  );
}
