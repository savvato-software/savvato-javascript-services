import { Injectable } from '@angular/core';

export interface Sequenceable {
  sequence: number;
};

@Injectable({
  providedIn: 'root'
})
export class SequenceService {

  /**
      Given a list of objects with a 'sequence' attribute, that is properly maintained so that the range
      starts at 1, and there are no gaps, this service will move the elements forward or back.

  **/

	list = undefined;

  	FORWARD = 1;
	BACKWARD = -1;

	UP = this.BACKWARD;
	DOWN = this.FORWARD;

  constructor() { }

  moveSequenceByOne(list: Sequenceable[], objToMove: Sequenceable, direction: number) {
    if (direction !== this.FORWARD && direction !== this.BACKWARD)
      throw new Error("Invalid value for 'direction' parameter");

  	let done = false;

    if (direction == this.FORWARD) {
      // moving to a higher sequence
      let follower = list.find((e) => { return e['sequence'] === objToMove['sequence'] + 1 })

      if (follower) {
        this.swapSequenceNumbers(follower, objToMove)
      }
    } else {
      let predecessor = list.find((e) => { return e["sequence"] === (objToMove["sequence"] - 1); })

      if (predecessor) {
        this.swapSequenceNumbers(predecessor, objToMove);
      }
    }

  	return objToMove;
  }

  swapSequenceNumbers(obj1: Sequenceable, obj2: Sequenceable) {
    let tmp = obj1["sequence"];
    obj1["sequence"] = obj2["sequence"];
    obj2["sequence"] = tmp;
  }

  isAbleToMove(list: Sequenceable[], objToMove: Sequenceable, direction: number) {
    if (direction !== this.FORWARD && direction !== this.BACKWARD)
      throw new Error("Invalid value for 'direction' parameter");

  	let max = -1;
  	list.forEach((o) => { if (o['sequence'] > max) max = o['sequence'] });

  	let lastObj = list.find((o) => o['sequence'] === max);

    if (lastObj) {
      if (direction == this.FORWARD) {
        // moving to a higher sequence
        return objToMove['sequence'] + direction <= lastObj['sequence']
      } else {
        return objToMove['sequence'] + direction > 0
      }
    }

    throw new Error("Unable to find last object in list. " + objToMove.hasOwnProperty('sequence') ? "" : "Object to move does not have a 'sequence' attribute.");
  }

    /**
     * Updates sequence numbers based on moving an item from one index to another.
     * Does not reorder the array itself—clients should sort by 'sequence' afterward.
     */
    reorderSequence(list: Sequenceable[], fromIndex: number, toIndex: number): Sequenceable[] {
        if (fromIndex < 0 || fromIndex >= list.length ||
            toIndex < 0 || toIndex >= list.length) {
            throw new Error(`Invalid fromIndex (${fromIndex}) or toIndex (${toIndex}).`);
        }

        const movedItem = list[toIndex];
        const oldSeq = movedItem.sequence;
        const newSeq = toIndex + 1;

        if (newSeq === oldSeq) {
            return list;
        }

        // Shift other items' sequences
        list.forEach(item => {
            if (item === movedItem) {
                return;
            }
            if (newSeq > oldSeq) {
                // moving down: decrement sequences between oldSeq+1 .. newSeq
                if (item.sequence > oldSeq && item.sequence <= newSeq) {
                    item.sequence = item.sequence - 1;
                }
            } else {
                // moving up: increment sequences between newSeq .. oldSeq-1
                if (item.sequence >= newSeq && item.sequence < oldSeq) {
                    item.sequence = item.sequence + 1;
                }
            }
        });

        movedItem.sequence = newSeq;
        return list;
    }
}
