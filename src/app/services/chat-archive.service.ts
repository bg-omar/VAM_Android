import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Represents a node in a conversation tree. Each node corresponds to a single
 * message in the chat. The `children` array holds the replies or edits that
 * stem from this message. The `weight` property is used to size the node in
 * the treemap and is proportional to the content length.
 */
export interface TreemapNode {
  id: string;
  authorRole: string;
  content: string;
  weight: number;
  children: TreemapNode[];
}

/**
 * A parsed conversation extracted from the ChatGPT backup. The `title` holds
 * the conversation name, while `roots` contains the top-level messages (those
 * without a parent). Each `TreemapNode` will already include the weights
 * aggregated from its subtree.
 */
export interface ParsedConversation {
  title: string;
  roots: TreemapNode[];
}

@Injectable({ providedIn: 'root' })
export class ChatArchiveService {
  constructor(private http: HttpClient) {}

  /**
   * Load the default archive packaged with the application. The file should be
   * located at `assets/data/backup.json`. Returns an observable that
   * emits once the file has been fetched and parsed.
   */
  loadDefaultArchive(): Observable<ParsedConversation[]> {
    return this.http.get<any>('assets/data/backup.json').pipe(
      map((json) => this.parseArchiveData(json)),
    );
  }

  /**
   * Parse arbitrary JSON into our internal representation of conversations.
   * The expected format is the backup format provided by the ChatGPT export,
   * which contains a `data` array with conversations. Each conversation has
   * a `mapping` object describing a tree of messages.
   *
   * This method is synchronous and may throw if the data is malformed.
   */
  parseArchiveData(json: any): ParsedConversation[] {
    if (!json || !Array.isArray(json.data)) {
      return [];
    }
    const conversations: ParsedConversation[] = [];
    for (const conv of json.data) {
      const mapping = conv.mapping;
      if (!mapping) {
        continue;
      }
      // First create TreemapNode objects for each message.
      const nodes: { [id: string]: TreemapNode } = {};
      Object.keys(mapping).forEach((id) => {
        const item = mapping[id];
        if (!item || !item.message || !item.message.content) {
          return;
        }
        // Flatten content parts into a single string.
        const parts: string[] = item.message.content.parts || [];
        const content = parts.join('\n');
        const weight = content ? content.length : 1;
        nodes[id] = {
          id,
          authorRole: item.message.author?.role || 'unknown',
          content,
          weight,
          children: [],
        };
      });
      // Link children to parents.
      Object.keys(mapping).forEach((id) => {
        const item = mapping[id];
        const parentId = item.parent;
        if (parentId && nodes[parentId] && nodes[id]) {
          nodes[parentId].children.push(nodes[id]);
        }
      });
      // Determine root nodes: those without a parent in the mapping or whose parent
      // isn't present. These represent top-level turns in the conversation.
      const roots: TreemapNode[] = [];
      Object.keys(nodes).forEach((id) => {
        const item = mapping[id];
        const parentId = item.parent;
        if (!parentId || !nodes[parentId]) {
          roots.push(nodes[id]);
        }
      });
      // Aggregate weights bottom-up so each node's weight reflects the sum of its
      // own content plus its descendants. This ensures larger subtrees get more
      // area in the treemap.
      const aggregateWeights = (node: TreemapNode): number => {
        let total = node.weight;
        for (const child of node.children) {
          total += aggregateWeights(child);
        }
        node.weight = total;
        return total;
      };
      roots.forEach((root) => aggregateWeights(root));
      conversations.push({ title: conv.title || '', roots });
    }
    return conversations;
  }
}