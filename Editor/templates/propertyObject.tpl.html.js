export default `<div class="property property--object">
  <button class="property__key"></button>

  {{#vals}}
  <label for="{{label}}_{{propName}}" class="property__label">{{propName}}</label>
  <input type="number" data-propname="{{propName}}" id="{{label}}_{{propName}}" class="property__input" value="{{val}}" />
  <br>
  {{/vals}}
</div>`;
