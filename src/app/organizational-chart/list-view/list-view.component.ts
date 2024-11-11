import
{
  BeforeOpenCloseMenuEventArgs,
  ContextMenuComponent,
  MenuEventArgs,
  MenuItemModel,
  NodeClickEventArgs,
  TreeViewComponent,
  TreeViewModule,
  ContextMenuModule,
  NodeEditEventArgs
} from '@syncfusion/ej2-angular-navigations'
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChartDataType, CONTEXT_MENU_ITEMS, ContextMenuItems, EntityRef, MOUSE_BUTTONS, OrganizationChartEvent, OrganizationChartEventArgs, OrganizationRole, ToggleItem } from '../../role';

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
export class ListViewComponent implements OnInit {

  @ViewChild('treevalidate') treevalidate?: TreeViewComponent;
  @ViewChild('contentmenutree') contentmenutree?: ContextMenuComponent;
  @Output() actionComplete = new EventEmitter<OrganizationChartEventArgs>();
  private localData: OrganizationRole[] = [];
  protected field: Object = { dataSource: this.localData, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild' };
  public menuItems: MenuItemModel[] = CONTEXT_MENU_ITEMS;
  public showUsers: boolean = true;
  private eventType: OrganizationChartEvent = ContextMenuItems.AddRole;
  public index: number = 1;

  constructor(private http: HttpClient) {

   }

  ngOnInit(): void {
    this.http.get<OrganizationRole[]>('assets/data/role-with-user.json')
      .subscribe((data: OrganizationRole[]) => {
        this.localData = this.mapOrganizationRole(data);
        this.updateDataSource(this.localData);
      });
  }

  protected nodeclicked(args: NodeClickEventArgs) : void {
    if (args.event.button === MOUSE_BUTTONS.RIGHT || args.event.button === MOUSE_BUTTONS.LEFT) {
      (this.treevalidate as TreeViewComponent).selectedNodes = [args.node.getAttribute('data-uid') as string];
    }
  }

  protected onNodeEditing(args: NodeEditEventArgs): void {
    if (args.node.parentNode?.parentNode?.nodeName !== "LI") {
      args.cancel = true;
    }
    const selectedData: OrganizationRole = args.nodeData as OrganizationRole;
    const node: OrganizationRole | undefined = this.localData.find(a => a.id == selectedData.id);
    if (!node || !node.isRole) {
      //args.cancel = true;
    }
  }

  protected beforeopen(args: BeforeOpenCloseMenuEventArgs) : void {
    let targetNodeId: string = this.treevalidate?.selectedNodes[0] as string;
    let targetNode: Element = document.querySelector('[data-uid="' + targetNodeId + '"]') as Element;

    if (targetNode.classList.contains('remove')) {
      this.contentmenutree?.enableItems(['Remove Item'], false);
    } else{
      this.contentmenutree?.enableItems(['Remove Item'], true);
    }

    if (targetNode.classList.contains('rename')) {
      this.contentmenutree?.enableItems(['Rename Item'], false);
    } else {
      this.contentmenutree?.enableItems(['Rename Item'], true);
    }
  }

  protected onNodeEdited(args: NodeEditEventArgs): void {
    const selectedData: any = args.nodeData as any;
    // const node: RoleWithUsers | undefined = this.localData.find(a => a.id == selectedData.id);
    // if (node) {
    //   node.name = args.newText;
    // }
    let targetNodeId: string = this.treevalidate?.selectedNodes[0] as string;
    switch (this.eventType) {

      case ContextMenuItems.AddRole:
        const role: OrganizationRole = {
          id: selectedData.id,
          name: args.newText,
          pid: selectedData.parentID,
          expanded: false,
          isRole: true,
        }
        const roleNode = this.localData.find(a => a.id == selectedData.id);
        if (roleNode)
        {
          roleNode.name = args.newText;
        }
        const roleData: ChartDataType = { type: 'organization', data: role };
        this.actionComplete.emit({ data: roleData, eventType: this.eventType });
        break;
      case ContextMenuItems.AddUser:
        const user: OrganizationRole = {
          id: selectedData.id,
          name: args.newText,
          pid: selectedData.parentID,
          expanded: false,
          isRole: false,
        }
        const userNode = this.localData.find(a => a.id == selectedData.id);
        if (userNode)
        {
          userNode.name = args.newText;
        }

        const userData: ChartDataType = { type: 'organization', data: user };
        this.actionComplete.emit({ data: userData, eventType: this.eventType });
        break;
    }
  }

  protected menuclick(args: MenuEventArgs): void {
    switch (args.item.text) {
      case ContextMenuItems.AddRole:
        this.addRole();
        break;
      case ContextMenuItems.AddUser:
        this.addUser();
        break;
      case ContextMenuItems.ShowHideUsers:
        this.onToggleUserByMenu();
        break;
      case ContextMenuItems.ShowHideRole:
        this.onToggleRole();
        break;
      case ContextMenuItems.RemoveRole:
        this.onRemoveRole();
        break;
      case ContextMenuItems.RemoveUser:
        this.onRemoveUser();
        break;
    }
  }

  protected addRole(): void {
    const selectedNode = this.getSelectedNode();
    let nodeId: string = "tree_" + this.index;
    let item: OrganizationRole = { id: nodeId, pid: selectedNode, name: "New Role", isRole: true, hasChild: false };
    this.treevalidate?.addNodes([item as unknown as { [key: string]: Object }], selectedNode, null as any);
    this.index++;
    this.localData.push(item);
    this.treevalidate?.beginEdit(nodeId);
    this.eventType = ContextMenuItems.AddRole;
  }

  protected addUser(): void {
    const selectedNode = this.getSelectedNode();
    let nodeId: string = "tree_" + this.index;
    let item: OrganizationRole = { id: nodeId, pid: selectedNode, name: "New User", isRole: false, hasChild: false };
    this.treevalidate?.addNodes([item as unknown as { [key: string]: Object }], selectedNode, null as any);
    this.index++;
    this.localData.push(item);
    this.treevalidate?.beginEdit(nodeId);
    this.eventType = ContextMenuItems.AddUser;
  }

  protected onToggleUsers(checked: boolean): void {
    this.showUsers = checked;
    const filteredData = checked ? this.localData : this.localData.filter(a => a.isRole);
    this.updateDataSource(filteredData);

    this.eventType = ContextMenuItems.ShowHideUsers;
    const toogleUser: ToggleItem = { id: 'all', showData: checked };
    const userData: ChartDataType = { type: 'toggle', data: toogleUser };
    this.actionComplete.emit({ data: userData, eventType: this.eventType });
  }

  private onToggleUserByMenu(): void {
    const selectedNode = this.getSelectedNode();
    const roleData = this.localData.find(a => a.id == selectedNode && a.isRole);
    if (roleData) {
      roleData.userHidden = !roleData.userHidden;
      this.localData.filter(a => a.pid == selectedNode && !a.isRole).map(a => a.hidden = roleData.userHidden);
      this.updateDataSource(this.localData);

      this.eventType = ContextMenuItems.ShowHideUsers;
      const toogleUser: ToggleItem = { id: selectedNode, showData: !roleData.userHidden };
      const userData: ChartDataType = { type: 'toggle', data: toogleUser };
      this.actionComplete.emit({ data: userData, eventType: this.eventType });
    }
  }

  private onToggleRole(): void {
    const selectedNode = this.getSelectedNode();
    const roleData = this.localData.find(a => a.id == selectedNode);
    if (roleData) {
      roleData.userHidden = !roleData.userHidden;
      this.localData.filter(a => a.pid == selectedNode || a.id == selectedNode).map(a => a.hidden = roleData.userHidden);
      this.updateDataSource(this.localData);

      this.eventType = ContextMenuItems.ShowHideRole;
      const toogleUser: ToggleItem = { id: selectedNode, showData: !roleData.userHidden, ids:[] };
      const userData: ChartDataType = { type: 'toggle', data: toogleUser };
      this.actionComplete.emit({ data: userData, eventType: this.eventType });
    }
  }

  private onRemoveRole(): void {
    const selectedNode = this.getSelectedNode();
    const roleData = this.localData.find(a => a.id == selectedNode && a.isRole);
    if (roleData) {
      this.localData = this.localData.filter(a => a.pid != selectedNode && a.id != selectedNode);
      this.updateDataSource(this.localData);

      this.eventType = ContextMenuItems.RemoveRole;
      const toogleUser: ToggleItem = { id: selectedNode, showData: false };
      const data: ChartDataType = { type: 'toggle', data: toogleUser };
      this.actionComplete.emit({ data: data, eventType: this.eventType });
    }
  }

  private onRemoveUser(): void {
    const selectedNode = this.getSelectedNode();
    const userData = this.localData.find(a => a.id == selectedNode && !a.isRole);
    if (userData) {
      this.localData = this.localData.filter(a => a.id != selectedNode);
      this.updateDataSource(this.localData);
      this.eventType = ContextMenuItems.RemoveUser;
      const toogleUser: ToggleItem = { pid: userData.pid, id: selectedNode, showData: false };
      const data: ChartDataType = { type: 'toggle', data: toogleUser };
      this.actionComplete.emit({ data: data, eventType: this.eventType });
    }
  }

  private mapOrganizationRole(roles: OrganizationRole[]): OrganizationRole[] {
    const roleWithUsers: OrganizationRole[] = [];

    roles.forEach(role =>{
      const hasChild =
              roles.some(r => r.pid === role.id) ||
              (role.users && role.users.length > 0);

      roleWithUsers.push({
        id: role.id,
        pid: role.pid,
        name: role.name,
        hasChild: hasChild,
        isRole: true,
        expanded: role.pid ? false : true,
        hidden: false,
        userHidden: false
      });

      role.users?.forEach((user: EntityRef) =>
      {
        roleWithUsers.push({
          id: user.id,
          pid: role.id,
          name: user.name,
          hasChild: false,
          expanded: false,
          isRole: false,
          hidden: false,
          userHidden: false
        });
      });
    });

    return roleWithUsers;
  }

  private updateDataSource(dataSource: OrganizationRole[]): void {
    this.field = { ...this.field, dataSource: dataSource};
    this.treevalidate?.refresh();
  }

  private getSelectedNode(): string {
    let selectedNode = this.getFirstSelectedNode();

     if (!selectedNode) {
        const rootNodes = this.getRootNodes();
        selectedNode = rootNodes.length > 0 ? rootNodes[0].id : '';
    }
    return selectedNode;
  }

  private getFirstSelectedNode(): string {
    const selectedNodes = (this.treevalidate as TreeViewComponent).selectedNodes;
    return selectedNodes.length > 0 ? selectedNodes[0] as string : '';
  }

  private getRootNodes(): OrganizationRole[] {
    const treeData = (this.treevalidate as TreeViewComponent).getTreeData() as OrganizationRole[];
    return treeData.filter((node) => !node.pid);
  }
}
