const legacyLocalePattern = /^\/(?:en|ar|es)(?=\/|$)/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (legacyLocalePattern.test(url.pathname)) {
      url.pathname = url.pathname.replace(legacyLocalePattern, "") || "/";
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  }
};
