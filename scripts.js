const btn = document.querySelector("button");
const input = document.querySelector("input");
class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }
  buildTree(array, start = 0, end = array.length - 1) {
    if (start > end) return null;
    let middle = Math.floor((start + end) / 2);
    let root = new Node(array[middle]);
    root.left = this.buildTree(array, start, middle - 1);
    root.right = this.buildTree(array, middle + 1, end);
    return root;
  }
  insert(value) {
    let current = this.root;
    let node = new Node(value);
    let parent = null;
    while (current) {
      parent = current;
      if (current.data === value) {
        console.log("Value already exist");
        return;
      }
      if (current.data > value) current = current.left;
      else if (value > current.data) current = current.right;
    }
    if (parent.data < value) parent.right = node;
    else if (parent.data > value) parent.left = node;
  }
  deleteItem(value) {
    let current = this.root;
    if (!current) return;
    let parent = null;
    while (current) {
      parent = current;
      if (current.data > value) current = current.left;
      else if (current.data < value) current = current.right;
      if (current === null) return;
      if (current.data === value) {
        //removing leaf node
        if (current.left === null && current.right === null) {
          if (parent.left === current) parent.left = null;
          else parent.right = null;
          return;
        }
        //removing nodes with subtree
        if (current.right !== null) {
          let originalNode = current;
          current = current.right;
          let currentIter = current;
          if (currentIter.left !== null) {
            let child = null;
            while (currentIter) {
              current = child;
              child = currentIter;
              currentIter = currentIter.left;
            }
            originalNode.data = child.data;
            if (child.right) current.left = child.right;
            else current.left = null;
          } else {
            originalNode.data = current.data;
            originalNode.right = current.right;
          }
        } else {
          parent.left = current.left;
        }
        return;
      }
    }
  }
  find(value) {
    let current = this.root;
    while (current) {
      if (current.data > value) current = current.left;
      else if (current.data < value) current = current.right;
      if (current.data === value) return current;
    }
  }
  levelOrder(callback) {
    if (!callback) throw new Error("Callback needed");
    try {
      let root = this.root;
      let que = [];
      que.push(root);
      while (que.length > 0) {
        let current = que.shift();
        callback(current);
        if (current.left) que.push(current.left);
        if (current.right) que.push(current.right);
      }
    } catch (e) {
      console.log(e);
    }
  }
  preOrder(callback, root = this.root) {
    if (root === null) return;
    callback(root);
    this.preOrder(callback, root.left);
    this.preOrder(callback, root.right);
  }
  inOrder(callback, root = this.root) {
    if (root === null) return;
    this.inOrder(callback, root.left);
    callback(root);
    this.inOrder(callback, root.right);
  }
  postOrder(callback, root = this.root) {
    if (root === null) return;

    this.postOrder(callback, root.left);
    this.postOrder(callback, root.right);
    callback(root);
  }
  height(value) {
    let current = this.root;
    while (current) {
      if (current.data === value) {
        return this.heightRec(current, null);
      }
      if (current.data > value) current = current.left;
      else if (current.data < value) current = current.right;
    }
  }
  depth(value) {
    let current = this.root;
    let count = 0;
    while (current) {
      if (current.data === value) return count;
      if (current.data > value) current = current.left;
      else if (current.data < value) current = current.right;
      count += 1;
    }
  }
  heightRec(root, callBack) {
    let flag = 0;
    if (root === null) return -1;
    let leftSub = this.heightRec(root.left, callBack);
    let rightSub = this.heightRec(root.right, callBack);
    if (callBack)
      flag = callBack(1 + parseInt(leftSub), 1 + parseInt(rightSub));
    if (flag === 1) return;
    return 1 + Math.max(leftSub, rightSub);
  }

  isBalance() {
    this.heightRec(this.root, (left, right) => {
      if (Math.abs(left - right) > 1) {
        console.log("Tree is not Balance");
        return 1;
      }
    });
  }
  reBalance() {
    let newArray = [];
    this.inOrder((node) => {
      newArray.push(node.data);
    });
    this.root = this.buildTree(newArray);
  }

  get() {
    return this.root;
  }
}

const array = Array.from({ length: 100 }, () => {
  return Math.floor(Math.random() * 100);
});

function removeDuplicates(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}
const tree = new Tree(mergeSort(removeDuplicates(array)));
tree.isBalance();
tree.insert(102);
tree.insert(105);
tree.insert(106);
tree.insert(110);
tree.insert(120);
tree.reBalance();
tree.isBalance();
tree.levelOrder((node) => console.log(node));
tree.preOrder((node) => console.log(node));
tree.postOrder((node) => console.log(node));
tree.inOrder((node) => console.log(node));

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};
prettyPrint(tree.get());

function mergeSort(arra) {
  if (arra.length <= 1) return arra;
  let middle = Math.floor(arra.length / 2);
  let left = mergeSort(arra.slice(0, middle));
  let right = mergeSort(arra.slice(middle));
  return merge(left, right);
}
function merge(left, right) {
  let temporary = [];
  let i = 0;
  let j = 0;
  while (left.length > i && right.length > j) {
    if (left[i] > right[j]) {
      temporary.push(right[j]);
      j++;
    } else {
      temporary.push(left[i]);
      i++;
    }
  }
  while (j < right.length) {
    temporary.push(right[j]);
    j++;
  }
  while (i < left.length) {
    temporary.push(left[i]);
    i++;
  }
  return temporary;
}
