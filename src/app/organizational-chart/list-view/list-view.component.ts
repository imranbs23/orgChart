import {
  BeforeOpenCloseMenuEventArgs,
  ContextMenuComponent,
  MenuEventArgs,
  MenuItemModel,
  NodeClickEventArgs,
  TreeViewComponent,
  TreeViewModule,
  ContextMenuModule,
  NodeEditEventArgs} from '@syncfusion/ej2-angular-navigations'
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Role } from '../../models/role';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

const MOUSE_BUTTONS = {
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2
};
enum ContextMenuItems {
  AddRole = 'Add Role',
  AddUser = 'Add User',
  RemoveRole = 'Remove Role',
  RemoveUser = 'Remove User',
  CollapseRole = 'Collapse Role',
  CollapseAll = 'Collapse All',
}
const CONTEXT_MENU_ITEMS = [
  { text: ContextMenuItems.AddRole },
  { text: ContextMenuItems.AddUser },
  { text: ContextMenuItems.RemoveRole },
  { text: ContextMenuItems.RemoveUser },
  { text: ContextMenuItems.CollapseRole },
  { text: ContextMenuItems.CollapseAll },
];

export declare class RoleWithUsers {
  id: string;
  pid?:string;
  name: string;
  hasChild?: boolean;
  expanded?: boolean;
  isRole: boolean;
  [key: string]: unknown;
}

export declare class RoleWithUsers1 {
  id: string;
  pid?:string;
  name: string;
  hasChild?: boolean;
  expanded?: boolean;
  isRole: boolean;
  [key: string]: unknown;
}

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.css',
  standalone: true,
  imports: [
    FormsModule,
    TreeViewModule,
    CommonModule,
    ContextMenuModule
  ]
})
export class ListViewComponent {
  @ViewChild ('treevalidate') treevalidate?: TreeViewComponent;
  @ViewChild ('contentmenutree') contentmenutree?: ContextMenuComponent;
  private localData: RoleWithUsers[] = [];
  protected field: Object = { dataSource: this.localData, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild' };
  public menuItems: MenuItemModel[] = CONTEXT_MENU_ITEMS;

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {
      this.http.get<Role[]>('assets/data/role-with-user.json')
        .subscribe((data:Role[]) => {
          this.localData = this.mapRolesToRoleWithUsers(data);
          this.field = { dataSource: this.localData, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild' };
        });
    }

    private mapRolesToRoleWithUsers(roles: Role[]): RoleWithUsers[] {
      const roleWithUsers: RoleWithUsers[] = [];

      roles.forEach(role => {
        // Check if the role has child roles or users
        const hasChild = roles.some(r => r.pid === role.id) || (role.users && role.users.length > 0);

        // Add the role itself
        roleWithUsers.push({
          id: role.id,
          pid: role.pid,
          name: role.name || '',
          hasChild: hasChild,
          isRole: true
        });

        // Add each user as a RoleWithUsers with isRole set to false
        role.users?.forEach(user => {
          roleWithUsers.push({
            id: user.id,
            pid: role.id,
            name: user.name || '',
            isRole: false
          });
        });
      });

      return roleWithUsers;
    }

    protected onNodeEditing(args: NodeEditEventArgs): void {
      if (args.node.parentNode?.parentNode?.nodeName !== "LI") {
        args.cancel = true;
      }
      const selectedData: RoleWithUsers = args.nodeData as RoleWithUsers;
      const node: RoleWithUsers | undefined = this.localData.find(a => a.id == selectedData.id);
      if (!node || !node.isRole) {
        args.cancel = true;
      }
    }

    public nodeclicked(args: NodeClickEventArgs) {
      if (args.event.button === MOUSE_BUTTONS.RIGHT) {
          (this.treevalidate as TreeViewComponent).selectedNodes = [args.node.getAttribute('data-uid') as string];
      }
  }

  public beforeopen(args: BeforeOpenCloseMenuEventArgs) {
    let targetNodeId: string = this.treevalidate?.selectedNodes[0] as string;
    let targetNode: Element = document.querySelector('[data-uid="' + targetNodeId + '"]') as Element;
    if (targetNode.classList.contains('remove')) {
        this.contentmenutree?.enableItems(['Remove Item'], false);
    }
    else {
        this.contentmenutree?.enableItems(['Remove Item'], true);
    }
    if (targetNode.classList.contains('rename')) {
        this.contentmenutree?.enableItems(['Rename Item'], false);
    }
    else {
        this.contentmenutree?.enableItems(['Rename Item'], true);
    }
}

  menuclick(args: MenuEventArgs): void {
    switch (args.item.text) {
      case ContextMenuItems.AddRole:
        // Existing logic for adding a role
        break;
      case ContextMenuItems.AddUser:
        // Existing logic for adding a user
        break;
      case ContextMenuItems.RemoveRole:
        // Existing logic for removing a role
        break;
      case ContextMenuItems.RemoveUser:
        // Existing logic for removing a user
        break;
    }
  }

  public index: number = 1;
  public menuclicka(args: MenuEventArgs) {
    let targetNodeId: string = this.treevalidate?.selectedNodes[0] as string;
    if (args.item.text == "Add New Item") {
      this.addRole(targetNodeId);
    }
    else if (args.item.text == "Remove Item") {
        this.treevalidate?.removeNodes([targetNodeId]);
    }
    else if (args.item.text == "Rename Item") {
        this.treevalidate?.beginEdit(targetNodeId);
    }
}

private addRole(targetNodeId: string,):void{
    let nodeId: string = "tree_" + this.index;
    let item: { [key: string]: Object } = { id: nodeId, name: "New Folder" };
      this.treevalidate?.addNodes([item], targetNodeId, null as any);
      this.index++;
      //this.localData.push(item);
      this.treevalidate?.beginEdit(nodeId);
}


}
