import React, { useState, useEffect } from "react";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

interface TreeNode {
  id: number;
  name: string;
  code: string;
  prefix: string;
  parentId: number;
  children: TreeNode[];
}

interface Props {
  data: any[];
  onAdd: (item: any) => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}

const TreeView: React.FC<Props> = ({ data, onEdit, onDelete, onAdd }) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  const buildTree = (data: any[]): TreeNode[] => {
    const map = new Map();
    const result: TreeNode[] = [];

    data.forEach((item) => {
      map.set(item.id, { ...item, children: [] });
    });

    data.forEach((item) => {
      if (item.parentId === 0) {
        result.push(map.get(item.id));
      } else {
        const parent = map.get(item.parentId);
        if (parent) {
          parent.children.push(map.get(item.id));
        }
      }
    });

    return result;
  };

  useEffect(() => {
    const tree = buildTree(data);
    setTreeData(tree);
  }, [data]);

  const renderTree = (nodes: TreeNode[]) => {
    return (
      <ul className="space-y-2 text-sm divide-y">
        {nodes.map((node) => (
          <li key={node.id} className="pl-1 pt-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">
                {node.name}{" "}
                <span className="text-xs text-red-700 bg-red-100 px-1 rounded-full">
                  {node.prefix}
                </span>
              </span>
              <div className="space-x-1">
                <button
                  onClick={() => onAdd(node)}
                  className="text-gray-400 hover:bg-teal-100 hover:text-teal-500 border rounded-full p-1"
                  aria-label="Add child"
                >
                  <FaPlus className="h-3 w-3" />
                </button>
                <button
                  onClick={() => onEdit(node)}
                  className="text-gray-400 hover:bg-orange-100 hover:text-orange-500 border rounded-full p-1"
                  aria-label="Edit"
                >
                  <FaPencil className="h-3 w-3" />
                </button>
                <button
                  onClick={() => onDelete(node)}
                  aria-label="Delete"
                  disabled={node.children.length > 0}
                  className={`text-gray-400 border rounded-full p-1 ${
                    node.children.length > 0 ? "cursor-not-allowed opacity-50" : "hover:bg-red-100 hover:text-red-500"
                  }`}
                >
                  <FaTrashAlt className="h-3 w-3" />
                </button>
              </div>
            </div>
            {node.children.length > 0 && (
              <div className="ml-4 mt-2">{renderTree(node.children)}</div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return <div>{renderTree(treeData)}</div>;
};

export default TreeView;
