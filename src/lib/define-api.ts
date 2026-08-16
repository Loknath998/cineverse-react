/**
 * Tiny builder used by the TMDB data layer.
 *
 * It keeps the declarative `method / inputValidator / handler` shape of the
 * data functions while running entirely in the browser:
 *
 *   const getMovie = defineApi({ method: "GET" })
 *     .inputValidator((d: { id: number }) => schema.parse(d))
 *     .handler(async ({ data }) => ...)
 *
 *   await getMovie({ data: { id: 27205 } })
 */

type Ctx<D> = { data: D };

type Builder<D> = {
  inputValidator<D2>(validate: (input: D2) => D2): Builder<D2>;
  handler<R>(fn: (ctx: Ctx<D>) => Promise<R>): (arg?: { data: D }) => Promise<R>;
};

export function defineApi(_options: { method?: "GET" | "POST" } = {}) {
  function make<D>(validate?: (input: any) => D): Builder<D> {
    return {
      inputValidator<D2>(next: (input: D2) => D2): Builder<D2> {
        return make<D2>(next as (input: any) => D2);
      },
      handler<R>(fn: (ctx: Ctx<D>) => Promise<R>) {
        return (arg?: { data: D }) =>
          fn({ data: (validate ? validate(arg?.data) : (arg?.data as D)) as D });
      },
    };
  }
  return make<undefined>();
}
