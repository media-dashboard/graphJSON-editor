## Notes
* Best way to establish has_many and belongs_to relationships bt/ models
  * nesting collections as model attributes?

* Graph data spec
  * http://jsongraphformat.info/

* Model-View bindings:
  * [Backbone.stickit](https://nytimes.github.io/backbone.stickit/)

* templates:
  * handlebars w/ hbsfy

* order of instantiating app:
  * should a model instantiate a view, or vice versa
  * AppView -> App -> GraphView -> Graph
  * or AppView -> App -> GraphView & Graph
  * or App -> AppView, App -> Graph -> GraphView


script.js
  |
  |----App
  |     |----Graph
  |           |----Nodes
  |           |----Edges
  |----AppView
        |----GraphView
