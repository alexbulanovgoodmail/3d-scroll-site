function requireAll(r) {
  r.keys().forEach(r);
}

requireAll(require.context('./', true, /\.(js|scss)$/));

// requireAll(require.context('./', true, /\.(js|scss|png|jpe?g|gif)$/));
