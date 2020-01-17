[![TC Build](https://ci.wildfly.org/app/rest/builds/buildType:(id:hal_Elemento)/statusIcon.svg)](https://ci.wildfly.org/viewType.html?buildTypeId=hal_Elemento&guest=1) ![GWT3/J2CL compatible](https://img.shields.io/badge/GWT3/J2CL-compatible-brightgreen.svg) [![License](https://img.shields.io/:license-apache-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0.html) [![Chat on Gitter](https://badges.gitter.im/hal/elemento.svg)](https://gitter.im/hal/elemento)

# Elemento

Elemento simplifies working with GWT [Elemental2](https://github.com/google/elemental2). In a nutshell Elemento brings the following features to the table:

- Ready to be used with J2CL and GWT 3
- Depends only on Elemental2, `org.gwtprojec.:event.gwt-event` and `org.gwtproject.safehtml:gwt-safehtml`
- Type safe [builders](#builder-api), [event handlers](#event-handlers) and [CSS selectors](#typesafe-css-selectors)
- [Helper methods](#helper-methods) to manipulate the DOM tree

**TOC**  
* [Get Started](#get-started)
* [Builder API](#builder-api)
  * [References](#references)
* [Event Handlers](#event-handlers)
* [Typesafe CSS Selectors](#typesafe-css-selectors)
* [Custom Elements](#custom-elements)
* [Goodies](#goodies)
  * [Attach / Detach](#attach--detach)
  * [Iterators / Iterables / Streams](#iterators--iterables--streams)
* [J2CL / GWT3](#j2cl--gwt-3)
* [Samples](#samples)
* [Contributing](#contributing)
* [Get Help](#get-help)

# Get Started

Elemento is available in [Maven Central](https://maven-badges.herokuapp.com/maven-central/org.elemento/elemento-core). To use it add the following dependency to your POM:

```xml
<dependency>
    <groupId>org.elemento</groupId>
    <artifactId>elemento-core</artifactId>
    <version>HEAD-SNAPSHOT</version>
</dependency>
```
 
In your GWT module inherit from `org.elemento.Core`:

```xml
<module>
    <inherits name="org.elemento.Core"/>
</module>
```

# Builder API

When working with GWT Elemental it is often awkward and cumbersome to create an hierarchy of elements. Even simple structures like

```html
<section class="main">
    <input class="toggle-all" type="checkbox">
    <label for="toggle-all">Mark all as complete</label>
    <ul class="todo-list">
        <li>
            <div class="view">
                <input class="toggle" type="checkbox" checked>
                <label>Taste Elemento</label>
                <button class="destroy"></button>
            </div>
            <input class="edit">
        </li>
    </ul>
</section>
```

lead to a vast amount of `Document.createElement()` and chained `Node.appendChild()` calls. With Elemento creating the above structure is as easy as

```java
import static org.elemento.Elements.*;
import static org.elemento.InputType.checkbox;
import static org.elemento.InputType.text;

HTMLElement section = section().css("main")
        .add(input(checkbox).id("toggle-all").css("toggle-all"))
        .add(label()
                .apply(l -> l.htmlFor = "toggle-all")
                .textContent("Mark all as complete"))
        .add(ul().css("todo-list")
                .add(li()
                        .add(div().css("view")
                                .add(input(checkbox)
                                        .css("toggle")
                                        .checked(true))
                                .add(label().textContent("Taste Elemento"))
                                .add(button().css("destroy")))
                        .add(input(text).css("edit"))))
        .element();
```

The class `Elements` provides convenience methods to create the most common elements. It uses a fluent API to create and append elements on the fly. Take a look at the [API documentation](http://rawgit.com/hal/elemento/site/apidocs/org/elemento/Elements.html) for more details.

## References

When creating large hierarchies of elements you often need to assign an element somewhere in the tree. Use an inline assignment together with `element()` to create and assign the element in one go:

```java
import static org.elemento.Elements.*;

final HTMLElement count;
final HTMLElement footer = footer()
        .add(count = span().css("todo-count").element())
        .element();
```

# Event Handlers

Elemento provides methods to easily register event handlers. There are [constants](http://rawgit.com/hal/elemento/site/apidocs/org/elemento/EventType.html) for most of the known event types. 

You can either add event handlers when building the element hierarchy:

```java
import static org.elemento.Elements.*;
import static org.elemento.EventType.*;
import static org.elemento.InputType.checkbox;
import static org.elemento.InputType.text;

HTMLLIElement listItem = li()
        .add(div().css("view")
                .add(input(checkbox)
                        .css("toggle")
                        .on(change, event -> toggle()))
                .add(label()
                        .textContent("Taste Elemento")
                        .on(dblclick, event -> edit()))
                .add(button()
                        .css("destroy")
                        .on(click, event -> destroy())))
        .add(input(text)
                .css("edit")
                .on(keydown, this::keyDown)
                .on(blur, event -> blur()))
        .element();
```

or register them later using `EventType.bind()`: 

```java
import org.gwtproject.event.shared.HandlerRegistration;
import static elemental2.dom.DomGlobal.alert;
import static org.elemento.EventType.bind;
import static org.elemento.EventType.click;

HandlerRegistration handler = bind(listItem, click, event -> alert("Clicked"));
```

The latter approach returns `org.gwtproject.event.shared.HandlerRegistration` which you can use to remove the handler again.

In order to make it easier to work with keyboard events, Elemento provides an [enum](http://rawgit.com/hal/elemento/site/apidocs/org/elemento/Key.html) with the most common keyboard codes:

```java
import elemental2.dom.KeyboardEvent;
import static org.elemento.Key.Escape;
import static org.elemento.Key.Enter;

void keyDown(KeyboardEvent event) {
    if (Escape.match(event)) {
        ...
    } else if (Enter.match(event)) {
        ...
    }
}
```

# Typesafe CSS Selectors

Elemento provides a typesafe selector API. It can be used to express simple CSS selector like `.class` or `#id` up to complex selectors like

```css
#main [data-list-item|=foo] a[href^="http://"] > .fas.fa-check, .external[hidden]
```

This selector can be created with

```java
import org.elemento.By;
import static org.elemento.By.AttributeOperator.CONTAINS_TOKEN;
import static org.elemento.By.AttributeOperator.STARTS_WITH;

By selector = By.group(
        By.id("main")
                .desc(By.data("listItem", CONTAINS_TOKEN, "foo")
                        .desc(By.element("a").and(By.attribute("href", STARTS_WITH, "http://"))
                                .child(By.classname(new String[]{"fas", "fa-check"})))),
        By.classname("external").and(By.attribute("hidden"))
);
```
The selector can be used to find single or all HTML elements:

```java
import org.elemento.By;
import static org.elemento.By.AttributeOperator.STARTS_WITH;
import static org.elemento.Elements.a;
import static org.elemento.Elements.body;

By selector = By.element("a").and(By.attribute("href", STARTS_WITH, "http://"));
for (HTMLElement element : body().findAll()) {
    a(element).css("external");
}
```

# Custom Elements

Elemento makes it easy to create custom elements. As for Elemento custom elements are a composite of HTML elements and / or other custom elements. They're ordinary classes which can hold state or register event handlers. The only requirement is to implement `IsElement<E extends HTMLElement>` and return a root element:

```java
import static org.elemento.Elements.*;

class TodoItemElement implements IsElement<HTMLElement> {
    
    private final HTMLElement root;
    private final HTMLInputElement toggle;
    private final HTMLElement label;
    private final HTMLInputElement summary;

    TodoItemElement(TodoItem item) {
        this.root = li().data("item", item.id)
                .add(div().css("view")
                        .add(toggle = input(checkbox).css("toggle")
                                .checked(item.completed)
                                .element())
                        .add(label = label().textContent(item.text).element())
                        .add(destroy = button().css("destroy").element()))
                .add(summary = input(text).css("edit").element())
                .element();
        this.root.classList.toggle("completed", item.completed);
    }
    
    @Override
    public HTMLElement element() {
        return root;
    }
    
    // event handlers omitted
}
```

The builder API has support for `IsElement<E extends HTMLElement>` which makes it easy to use custom elements when building the element hierarchy:

```java
import static org.elemento.Elements.ul;

TodoItemRepository repository = ...;
TodoItemElement[] itemElements = repository.items().stream()
        .map(TodoItemElement::new)
        .toArray();
ul().addAll(itemElements).element();
``` 

# Goodies

Besides the builder API, Elemento comes with a bunch of static helper methods that roughly fall into these categories:

1. Get notified when an element is attached to and detached from the DOM tree. 
1. Iterate over elements.
1. Methods to manipulate the DOM tree (add, insert and remove elements).
1. Methods to manipulate an element.
1. Methods to generate safe IDs.

See the API documentation of [Elements](https://rawgit.com/hal/elemento/site/apidocs/org/elemento/Elements.html) for more details.

## Attach / Detach

Implement `Attachable` to get notified when an element is attached to and detached from the DOM tree. The attachable interface provides a static method to easily register the callbacks to `attach(MutationRecord)` and `detach(MutationRecord)`:   

```java
import elemental2.dom.MutationRecord;
import org.elemento.Attachable;
import org.elemento.IsElement;
import static elemental2.dom.DomGlobal.console;
import static org.elemento.Elements.li;

class TodoItemElement implements IsElement<HTMLElement>, Attachable {
    
    private final HTMLElement root;

    TodoItemElement(TodoItem item) {
        this.root = li().element();
        Attachable.register(root, this);
    }
    
    @Override
    public HTMLElement element() {
        return root;
    }

    @Override
    public void attach(MutationRecord mutationRecord) {
        console.log("Todo item has been attached");
    }

    @Override
    public void detach(MutationRecord mutationRecord) {
        console.log("Todo item has been detached");
    }
}
```

Elemento uses the [`MutationObserver`](https://developer.mozilla.org/docs/Web/API/MutationObserver) API to detect changes in the DOM tree and passes an [`MutationRecord`](https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord) instance to the `attach(MutationRecord)` and `detach(MutationRecord)` methods. This instance contains additional information about the DOM manipulation.

## Iterators / Iterables / Streams

Elemento provides several methods to iterate over node lists, child elements or elements returned by a selector. There are methods which return `Iterator`, `Iterable` and `Stream`.   

See the API documentation of [Elements](https://rawgit.com/hal/elemento/site/apidocs/org/elemento/Elements.html) for more details.

# J2CL / GWT 3

Elemento is ready to be used with J2CL and GWT 3. It has no dependencies to classes from `com.google.gwt`. It only depends on

- `com.google.elemental2:elemental2-core`
- `com.google.elemental2:elemental2-dom`
- `com.google.elemental2:elemental2-webstorage`
- `org.gwtprojec.:event.gwt-event` and 
- `org.gwtproject.safehtml:gwt-safehtml`

# Samples

Elemento comes with different [implementations](https://hal.github.io/elemento/index.html) of the [TodoMVC](http://todomvc.com/) application:
                     
- GWT: [Source](samples/gwt) | [Demo](https://hal.github.io/elemento/gwt/index.html)
- J2CL: [Source](samples/j2cl) | [Demo](https://hal.github.io/elemento/j2cl/index.html)

All samples use the same key to persist the todo items in the local storage. So you can switch between the samples and continue working on your tasks seamlessly ;-)

# Contributing

If you want to contribute to Elemento, please follow the steps in [contribution](CONTRIBUTING.md).

# Get Help

If you need help feel free to contact us at Gitter, browse the API documentation or file an issue.

- [Gitter Channel](https://gitter.im/hal/elemento)
- [API documentation](http://rawgit.com/hal/elemento/site/apidocs/index.html)
- [Issues](https://github.com/hal/elemento/issues)
