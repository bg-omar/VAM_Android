import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ParsedConversation, TreemapNode } from '../services/chat-archive.service';

interface LayoutItem {
  node: TreemapNode;
  x: number;
  y: number;
  w: number;
  h: number;
}

@Component({
  selector: 'app-chat-archive',
  templateUrl: './chat-archive.component.html',
  styleUrls: ['./chat-archive.component.css'],
})
export class ChatArchiveComponent implements OnChanges {
  /** The conversation to visualise as a treemap. */
  @Input() conversation: ParsedConversation | null = null;

  /** Flattened list of layout items computed from the conversation tree. */
  layoutItems: LayoutItem[] = [];

  /** Currently selected node for which details should be displayed. */
  selectedNode: TreemapNode | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversation']) {
      this.computeLayout();
    }
  }

  /**
   * Compute a slice-and-dice treemap layout for the current conversation.
   * The resulting rectangles fill the unit square [0,1]×[0,1].
   */
  private computeLayout(): void {
    this.layoutItems = [];
    this.selectedNode = null;
    if (!this.conversation || !this.conversation.roots) {
      return;
    }
    const roots = this.conversation.roots;
    const totalWeight = roots.reduce((sum, n) => sum + n.weight, 0);
    // Root nodes occupy the full container horizontally (or vertically if only one). Use horizontal slice for first level.
    let offset = 0;
    for (const root of roots) {
      const ratio = totalWeight > 0 ? root.weight / totalWeight : 1 / roots.length;
      const w = ratio;
      this.layoutNode(root, offset, 0, w, 1, false);
      offset += w;
    }
  }

  /**
   * Recursively layout a node and its children. Coordinates are relative to the unit
   * square and stored in the `layoutItems` array. The orientation flag toggles
   * between vertical and horizontal slicing at each depth.
   */
  private layoutNode(node: TreemapNode, x: number, y: number, w: number, h: number, horizontal: boolean): void {
    this.layoutItems.push({ node, x, y, w, h });
    if (!node.children || node.children.length === 0) {
      return;
    }
    const total = node.children.reduce((sum, c) => sum + c.weight, 0);
    let offset = 0;
    for (const child of node.children) {
      const ratio = total > 0 ? child.weight / total : 1 / node.children.length;
      if (horizontal) {
        // Divide horizontally: children laid out left-to-right across width.
        const childW = w * ratio;
        this.layoutNode(child, x + offset, y, childW, h, !horizontal);
        offset += childW;
      } else {
        // Divide vertically: children laid out top-to-bottom across height.
        const childH = h * ratio;
        this.layoutNode(child, x, y + offset, w, childH, !horizontal);
        offset += childH;
      }
    }
  }

  /**
   * Determine a CSS-friendly color for a node based on the author role. User
   * messages are tinted blue, assistant messages green, and anything else grey.
   */
  getColorForRole(role: string): string {
    switch (role) {
      case 'user':
        return '#a0c4ff';
      case 'assistant':
        return '#caffbf';
      default:
        return '#dddddd';
    }
  }

  /**
   * Handle click on a treemap rectangle: update the selected node to display
   * details in the side panel.
   */
  onNodeClick(item: LayoutItem): void {
    this.selectedNode = item.node;
  }
}