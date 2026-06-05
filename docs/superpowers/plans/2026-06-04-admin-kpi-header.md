# Admin KPI Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a compact KPI header to the Home page, visible only for admin users, using the existing GraphQL KPIs.

**Architecture:** The frontend will request a combined GraphQL dashboard query through `adminService`, summarize the response into display-ready KPI cards, and render them in a new Home-only component. The Home page remains responsible for book search/popular loading, while the KPI header has its own loading/error state so the catalog keeps working if GraphQL fails.

**Tech Stack:** React, TypeScript, Vite, Vitest, React Testing Library, Axios, TailwindCSS, Netflix DGS GraphQL endpoint exposed by the Spring backend.

---

## File Structure

- Modify: `src/models/libroModel.ts`
  - Add `AdminKpiResumenResponse`, a frontend-only summary type.
- Modify: `src/services/adminService.ts`
  - Add `obtenerResumenKpisHome()` that sends one GraphQL query containing `tasaConversion` and `analisisCalificaciones`, then maps the raw response into summary KPIs.
- Create: `src/components/home/AdminKpiHeader.tsx`
  - Render compact KPI cards for admin Home.
- Modify: `src/pages/Home.tsx`
  - Detect admin via `authService.obtenerTipoUsuarioActual()`.
  - Load KPI summary only for admin users.
  - Render `AdminKpiHeader` below the Home hero copy and above the catalog body.
- Modify: `src/test/services/adminService.test.ts`
  - Add service tests for the combined KPI query and summary mapping.
- Modify: `src/test/home/home.test.tsx`
  - Add Home tests proving the KPI service is called only for admin and not for non-admin users.

## Task 1: Service Summary for Home KPIs

**Files:**
- Modify: `src/models/libroModel.ts`
- Modify: `src/services/adminService.ts`
- Test: `src/test/services/adminService.test.ts`

- [ ] **Step 1: Write the failing service tests**

Append these tests to `src/test/services/adminService.test.ts`:

```ts
describe("adminService - obtenerResumenKpisHome", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("envia una consulta GraphQL combinada y resume los KPIs del home admin", async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        data: {
          tasaConversion: [
            {
              libroId: 7,
              titulo: "Rayuela",
              clicks: 20,
              reservas: 5,
              tasaConversion: 0.25,
            },
            {
              libroId: 8,
              titulo: "Ficciones",
              clicks: 10,
              reservas: 5,
              tasaConversion: 0.5,
            },
          ],
          analisisCalificaciones: [
            { tipoLibro: "Comun", promedioCalificacion: 4.2 },
            { tipoLibro: "Coleccionable", promedioCalificacion: 4.8 },
          ],
        },
      },
    } as any)

    const result = await adminService.obtenerResumenKpisHome()

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      "/graphql",
      expect.objectContaining({
        query: expect.stringContaining("tasaConversion"),
      }),
    )
    const body = mockedApiClient.post.mock.calls[0][1] as { query: string }
    expect(body.query).toContain("analisisCalificaciones")
    expect(body.query).toContain("promedioCalificacion")
    expect(result).toEqual({
      conversionPromedio: 0.375,
      libroMasClickeado: {
        titulo: "Rayuela",
        clicks: 20,
      },
      mejorTipoCalificado: {
        tipoLibro: "Coleccionable",
        promedioCalificacion: 4.8,
      },
      tiposEvaluados: 2,
    })
  })

  it("devuelve resumen vacio cuando GraphQL no trae datos", async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        data: {
          tasaConversion: [],
          analisisCalificaciones: [],
        },
      },
    } as any)

    const result = await adminService.obtenerResumenKpisHome()

    expect(result).toEqual({
      conversionPromedio: 0,
      libroMasClickeado: null,
      mejorTipoCalificado: null,
      tiposEvaluados: 0,
    })
  })
})
```

- [ ] **Step 2: Run the service tests and verify they fail**

Run:

```bash
pnpm test --run src/test/services/adminService.test.ts
```

Expected: FAIL because `adminService.obtenerResumenKpisHome` and `AdminKpiResumenResponse` do not exist yet.

- [ ] **Step 3: Add the summary type**

Append to `src/models/libroModel.ts` after `PromedioCalificacionPorTipoResponse`:

```ts
export type AdminKpiResumenResponse = {
  conversionPromedio: number
  libroMasClickeado: {
    titulo: string
    clicks: number
  } | null
  mejorTipoCalificado: PromedioCalificacionPorTipoResponse | null
  tiposEvaluados: number
}
```

- [ ] **Step 4: Implement the service method**

Update the import at the top of `src/services/adminService.ts` to include the new type:

```ts
import type { AdminKpiResumenResponse, CantidadColeccionablesResponse, PromedioCalificacionPorTipoResponse, TasaConversionLibroResponse } from "../models/libroModel"
```

Add this method inside the exported `adminService` object, after `obtenerAnalisisCalificaciones()`:

```ts
    async obtenerResumenKpisHome(): Promise<AdminKpiResumenResponse> {
        const query = `
            query {
                tasaConversion {
                    libroId
                    titulo
                    clicks
                    reservas
                    tasaConversion
                }
                analisisCalificaciones {
                    tipoLibro
                    promedioCalificacion
                }
            }
        `
        const res = await apiClient.post('/graphql', { query })
        const tasaConversion = res.data.data.tasaConversion as TasaConversionLibroResponse[]
        const analisisCalificaciones = res.data.data.analisisCalificaciones as PromedioCalificacionPorTipoResponse[]
        const conversionPromedio = tasaConversion.length === 0
            ? 0
            : tasaConversion.reduce((acc, item) => acc + item.tasaConversion, 0) / tasaConversion.length
        const libroMasClickeado = tasaConversion[0]
            ? { titulo: tasaConversion[0].titulo, clicks: tasaConversion[0].clicks }
            : null
        const mejorTipoCalificado = analisisCalificaciones.reduce<PromedioCalificacionPorTipoResponse | null>(
            (mejor, actual) => mejor === null || actual.promedioCalificacion > mejor.promedioCalificacion ? actual : mejor,
            null,
        )

        return {
            conversionPromedio,
            libroMasClickeado,
            mejorTipoCalificado,
            tiposEvaluados: analisisCalificaciones.length,
        }
    }
```

- [ ] **Step 5: Run the service tests and verify they pass**

Run:

```bash
pnpm test --run src/test/services/adminService.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit Task 1**

Run:

```bash
git add src/models/libroModel.ts src/services/adminService.ts src/test/services/adminService.test.ts
git commit -m "feat: add admin home kpi summary service"
```

## Task 2: Admin KPI Header Component

**Files:**
- Create: `src/components/home/AdminKpiHeader.tsx`
- Test indirectly in: `src/test/home/home.test.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/home/AdminKpiHeader.tsx`:

```tsx
import { Activity, BookOpen, Star, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"
import type { AdminKpiResumenResponse } from "../../models/libroModel"
import { TIPO_LABEL } from "../../models/libroModel"

type AdminKpiHeaderProps = {
  resumen: AdminKpiResumenResponse | null
  loading: boolean
  error: string
}

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`
const formatRating = (value: number) => value.toFixed(2)

export function AdminKpiHeader({ resumen, loading, error }: AdminKpiHeaderProps) {
  const cards = [
    {
      label: "Conversión promedio",
      value: loading ? "..." : formatPercent(resumen?.conversionPromedio ?? 0),
      helper: "Top 5 por clicks",
      icon: TrendingUp,
    },
    {
      label: "Top clickeado",
      value: loading ? "..." : resumen?.libroMasClickeado?.titulo ?? "Sin clicks",
      helper: loading ? "Calculando" : `${resumen?.libroMasClickeado?.clicks ?? 0} clicks`,
      icon: BookOpen,
    },
    {
      label: "Mejor tipo",
      value: loading
        ? "..."
        : resumen?.mejorTipoCalificado
          ? TIPO_LABEL[resumen.mejorTipoCalificado.tipoLibro] ?? resumen.mejorTipoCalificado.tipoLibro
          : "Sin reseñas",
      helper: loading || !resumen?.mejorTipoCalificado
        ? "Promedio por tipo"
        : formatRating(resumen.mejorTipoCalificado.promedioCalificacion),
      icon: Star,
    },
    {
      label: "Tipos evaluados",
      value: loading ? "..." : String(resumen?.tiposEvaluados ?? 0),
      helper: "Con libros calificados",
      icon: Activity,
    },
  ]

  return (
    <section
      data-testid="admin-kpi-header"
      className="mt-5 rounded-lg border border-primary/20 bg-surface/70 p-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-bold text-on-surface">KPIs administrador</h2>
          <p className="text-xs text-on-surface-variant/70">
            Resumen GraphQL del catálogo y actividad reciente.
          </p>
        </div>
        <Link
          to="/consultas"
          className="text-xs font-bold text-primary hover:text-primary-light transition-colors"
        >
          Ver detalle
        </Link>
      </div>

      {error && (
        <p data-testid="admin-kpi-error" className="mb-3 text-xs font-semibold text-red-400">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {cards.map(({ label, value, helper, icon: Icon }) => (
          <article
            key={label}
            className="min-h-24 rounded-lg border border-accent/15 bg-background/40 p-3"
          >
            <div className="flex items-center gap-2 text-primary mb-2">
              <Icon size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
            </div>
            <p className="text-lg font-serif font-bold text-on-surface truncate" title={value}>
              {value}
            </p>
            <p className="text-xs text-on-surface-variant/60 mt-1">{helper}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Run TypeScript compile and expect current Home not to use the component yet**

Run:

```bash
pnpm build
```

Expected: PASS or the same pre-existing repository warnings only. The component is created but not rendered.

- [ ] **Step 3: Commit Task 2**

Run:

```bash
git add src/components/home/AdminKpiHeader.tsx
git commit -m "feat: add admin kpi header component"
```

## Task 3: Home Integration for Admin Only

**Files:**
- Modify: `src/pages/Home.tsx`
- Modify: `src/test/home/home.test.tsx`

- [ ] **Step 1: Write failing Home tests**

Update the mock in `src/test/home/home.test.tsx`:

```ts
vi.mock('../../services/AuthService', () => ({
    authService: {
        obtenerIdUsuarioActual: vi.fn(),
        obtenerTipoUsuarioActual: vi.fn(),
    }
}))
```

Add an admin service mock after the auth mock:

```ts
vi.mock('../../services/adminService', () => ({
    adminService: {
        obtenerResumenKpisHome: vi.fn(),
    }
}))
```

Add the import and mocked constant:

```ts
import { adminService } from '../../services/adminService'

const mockedAdminService = vi.mocked(adminService)
```

In `beforeEach`, add:

```ts
        mockedAuthService.obtenerTipoUsuarioActual.mockReturnValue('Lector')
        mockedAdminService.obtenerResumenKpisHome.mockResolvedValue({
            conversionPromedio: 0,
            libroMasClickeado: null,
            mejorTipoCalificado: null,
            tiposEvaluados: 0,
        })
```

Append these tests:

```ts
    it('no carga KPIs cuando el usuario no es admin', async () => {
        mockedHomeService.getPopulares.mockResolvedValueOnce(responseMock())
        renderHome()

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        expect(mockedAdminService.obtenerResumenKpisHome).not.toHaveBeenCalled()
        expect(screen.queryByTestId('admin-kpi-header')).not.toBeInTheDocument()
    })

    it('carga y muestra KPIs cuando el usuario es admin', async () => {
        mockedAuthService.obtenerTipoUsuarioActual.mockReturnValue('ADMIN')
        mockedHomeService.getPopulares.mockResolvedValueOnce(responseMock())
        mockedAdminService.obtenerResumenKpisHome.mockResolvedValueOnce({
            conversionPromedio: 0.25,
            libroMasClickeado: { titulo: 'Rayuela', clicks: 20 },
            mejorTipoCalificado: { tipoLibro: 'Coleccionable', promedioCalificacion: 4.8 },
            tiposEvaluados: 2,
        })

        renderHome()

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        expect(mockedAdminService.obtenerResumenKpisHome).toHaveBeenCalledTimes(1)
        expect(screen.getByTestId('admin-kpi-header')).toBeInTheDocument()
        expect(screen.getByText('25.0%')).toBeInTheDocument()
        expect(screen.getByText('Rayuela')).toBeInTheDocument()
        expect(screen.getByText('Coleccionable')).toBeInTheDocument()
    })
```

- [ ] **Step 2: Run Home tests and verify they fail**

Run:

```bash
pnpm test --run src/test/home/home.test.tsx
```

Expected: FAIL because `Home` does not call `adminService.obtenerResumenKpisHome()` or render `AdminKpiHeader`.

- [ ] **Step 3: Implement Home admin KPI state**

In `src/pages/Home.tsx`, add imports:

```ts
import { adminService } from "../services/adminService"
import { AdminKpiHeader } from "../components/home/AdminKpiHeader"
import type { AdminKpiResumenResponse } from "../models/libroModel"
```

Add state near the existing state declarations:

```ts
  const [adminKpis, setAdminKpis] = useState<AdminKpiResumenResponse | null>(null)
  const [loadingAdminKpis, setLoadingAdminKpis] = useState(false)
  const [errorAdminKpis, setErrorAdminKpis] = useState("")
```

Add admin detection after `userId`:

```ts
  const esAdmin = authService.obtenerTipoUsuarioActual()?.toUpperCase() === "ADMIN"
```

Add this loader function before `useOnInit`:

```ts
  const cargarAdminKpis = async () => {
    if (!esAdmin) return
    setLoadingAdminKpis(true)
    setErrorAdminKpis("")
    try {
      const data = await adminService.obtenerResumenKpisHome()
      setAdminKpis(data)
    } catch {
      setErrorAdminKpis("No se pudieron cargar los KPIs")
    } finally {
      setLoadingAdminKpis(false)
    }
  }
```

Change `useOnInit` to:

```ts
  useOnInit(() => {
    search("", INITIAL_FILTERS, 0)
    cargarAdminKpis()
  })
```

- [ ] **Step 4: Render the header only for admins**

Inside the hero header, after the desktop search block and before the closing `</div>` of the outer hero container, add:

```tsx
        {esAdmin && (
          <AdminKpiHeader
            resumen={adminKpis}
            loading={loadingAdminKpis}
            error={errorAdminKpis}
          />
        )}
```

The rendered structure should keep the search row intact. If the markup puts the KPI header inside the flex row, move it below that row so it spans the header width:

```tsx
      <div className="px-6 md:px-10 pt-24 pb-6 border-b border-accent/10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          ...
        </div>
        {esAdmin && (
          <AdminKpiHeader
            resumen={adminKpis}
            loading={loadingAdminKpis}
            error={errorAdminKpis}
          />
        )}
      </div>
```

- [ ] **Step 5: Run Home tests and verify they pass**

Run:

```bash
pnpm test --run src/test/home/home.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit Task 3**

Run:

```bash
git add src/pages/Home.tsx src/test/home/home.test.tsx
git commit -m "feat: show admin kpis on home"
```

## Task 4: Verification and Documentation

**Files:**
- Modify: `docs/superpowers/plans/2026-06-04-admin-kpi-header.md`

- [ ] **Step 1: Run targeted tests**

Run:

```bash
pnpm test --run src/test/services/adminService.test.ts src/test/home/home.test.tsx
```

Expected: PASS.

- [ ] **Step 2: Run full frontend verification**

Run:

```bash
pnpm test --run
pnpm build
```

Expected: PASS for both commands.

- [ ] **Step 3: Check lint status without treating existing dependency setup as this task's failure**

Run:

```bash
pnpm lint
```

Expected: If it fails with `Cannot find package '@eslint/js' imported from eslint.config.js`, record that as an existing repository setup issue. If it fails for files changed in this task, fix those issues and rerun.

- [ ] **Step 4: Commit the implementation plan**

Run:

```bash
git add docs/superpowers/plans/2026-06-04-admin-kpi-header.md
git commit -m "docs: add admin kpi header implementation plan"
```

- [ ] **Step 5: Final status check**

Run:

```bash
git status --short
git log --oneline -5
```

Expected: working tree clean and commits present for service, component, Home integration, and plan.

## Self-Review

- Spec coverage: The plan covers admin-only visibility, GraphQL KPI loading, a compact Home header, non-blocking error handling, tests, and verification.
- Placeholder scan: No TODO/TBD placeholders remain. Each code-changing step includes concrete code.
- Type consistency: `AdminKpiResumenResponse`, `obtenerResumenKpisHome`, `AdminKpiHeader`, and test mocks use the same names across tasks.
