export default function WebmasterLoginPage() {
  return (
    <section className="mx-auto max-w-md space-y-4">
      <h1 className="h1 text-center">Webmaster Login</h1>
      <form className="card space-y-3">
        <label className="block space-y-1 text-sm">
          <span>Usuario</span>
          <input className="field" type="text" placeholder="usuario" />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Contraseña</span>
          <input className="field" type="password" placeholder="••••••••" />
        </label>
        <button type="button" className="btn-primary w-full">
          Iniciar sesión
        </button>
      </form>
    </section>
  );
}
