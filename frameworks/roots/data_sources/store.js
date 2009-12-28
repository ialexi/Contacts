// ==========================================================================
// Project:   Roots.Source
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Roots */

/** @class
  Data store for experimental Roots back-end.
  
  Basically, this _is_ SC.Store, but with some stuff to automatically
  set the dataSource to a Roots data source, and easily propogate settings.

  @extends SC.Store
*/
require("data_sources/source");
Roots.Store = SC.Store.extend(
/** @scope Roots.Source.prototype */ {
  /**
  The map between server-side attach points and client-side models. This
  is convenience.
  */
  map: {
    
  },
  
  rootPath: "",
  
  init: function(){
    sc_super();
    this.set("dataSource", Roots.Source.create({
      map: this.map,
      rootPath: this.rootPath
    }));
  }
  
}) ;
