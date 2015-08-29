## Notes
* Best way to establish has_many and belongs_to relationships bt/ models
  * nesting collections as model attributes?

* Graph data spec
  * http://jsongraphformat.info/

* Model-View bindings:
  * [Backbone.stickit](https://nytimes.github.io/backbone.stickit/)

* templates:
  * handlebars w/ hbsfy

* API: modification (local) vs. save (server)
  * model.save() // save to server (possibly only saving a diff of the data?)
    * delete all models/views that have been removed
  * model.remove() // temporarily remove model's view DOM element, but don't delete the model

* order of instantiating app:
  * should a model instantiate a view, or vice versa
  * AppView -> App -> GraphView -> Graph
  * or AppView -> App -> GraphView & Graph
  * or App -> AppView, App -> Graph -> GraphView

```
script.js
  |
  |----App
  |     |----Graph
  |           |----Nodes----Node
  |           |----Edges----Edge
  |
  |----AppView
        |----GraphView
```

## principles

* Non-destructive data editing: 
> apply diffs to the data, but don't permanently alter the dataset, unless that modification can be applied to the upstream source
  * create an immutable graph history object that records changes
  * creating/destroying nodes/edges modifies the collections/models, and writes changes to history, but does not sync w/ server
  * commit event writes all changes as a changeset to server
  * fetch:data fetches raw data
  * fetch:changeset fetches and applies changeset
