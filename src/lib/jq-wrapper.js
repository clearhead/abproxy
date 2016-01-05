export default function jqWrapper(script) {
  const prefix = ';(function($) {'
  const postfix = '})(window.optimizely && window.optimizely.$ || window.jQuery);'

  return prefix + script + postfix;
}
