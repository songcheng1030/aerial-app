/* eslint-disable max-classes-per-file */
import React from 'react'

export class _RouteData<T extends string> {
  constructor(public collection: T, public name: string, public node: React.ReactNode) {}

  get path(): [T] {
    return [this.collection]
  }
}

export class _DetailRouteData<T extends string> {
  constructor(
    public collection: T,
    public name: string,
    public backLink: string,
    public node: (id: string) => React.ReactNode
  ) {}
}
