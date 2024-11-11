import { DiagramAllModule } from '@syncfusion/ej2-angular-diagrams';
import { Component, ViewEncapsulation, ViewChild, Input, SimpleChanges } from '@angular/core';
import { DiagramComponent, Diagram, NodeModel, ConnectorModel, LayoutAnimation, SnapSettingsModel, DiagramTools, DataBinding, HierarchicalTree, SnapConstraints } from '@syncfusion/ej2-angular-diagrams';
import { DataManager, DataOptions } from '@syncfusion/ej2-data';
import { DataSourceModel, DiagramConstraints, IClickEventArgs, ISelectionChangeEventArgs, LayoutModel, NodeConstraints } from '@syncfusion/ej2-diagrams';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ContextMenuItems, EntityRef, OrganizationChartEvent, OrganizationChartEventArgs, OrganizationRole, ToggleItem } from '../../role';

Diagram.Inject(DataBinding, HierarchicalTree, LayoutAnimation);


@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrl: './chart-view.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    DiagramAllModule,
    CommonModule
  ],
})
export class ChartViewComponent
{
  @Input()
  listData: OrganizationChartEventArgs | null = null;
  @ViewChild('diagram')
  public diagram!: DiagramComponent;
  public snapSettings: SnapSettingsModel = {
    constraints: SnapConstraints.None,
  };
  public tool = DiagramTools.Default;
  public diagramConstraints = DiagramConstraints.Default & ~DiagramConstraints.UserInteraction;

  private bindNodeData(nodeModel: NodeModel, data: object, diagram: Diagram): void
  {
    nodeModel.shape = {
      type: 'Text',
      content: (data as OrganizationRole).name,
      margin: { left: 10, right: 10, top: 10, bottom: 10 },
    };
  }

  public dataSourceSettings: DataSourceModel = {
    id: 'id',
    parentId: 'pid',
    dataSource: new DataManager([]),
    doBinding: this.bindNodeData.bind(this)
  };

  public layout: LayoutModel = {
    type: 'HierarchicalTree',
    verticalSpacing: 60,
    horizontalSpacing: 40,
    enableAnimation: true,
    orientation: 'TopToBottom',
    margin: { top: 20, left: 20 }
  };

  public created()
  {
    //this.diagram.created();
  }

  public nodeDefaults(node: NodeModel): NodeModel
  {
    node.shape = { type: 'HTML' };;
    node.width = 160;
    node.height = 70;
    node.style = { strokeWidth: 1, strokeColor: 'whitesmoke', fill: 'CornflowerBlue' };
    node.annotations = [{ content: (node.data as any).name, style: { color: 'white' } }];
    node.constraints = NodeConstraints.Default | NodeConstraints.AllowDrop;
    node.expandIcon = { height: 0, width: 0 };
    node.collapseIcon = { height: 0, width: 0 };
    return node;
  }
  public connectorDefaults(obj: ConnectorModel, diagram: Diagram): ConnectorModel
  {
    obj.type = 'Orthogonal';
    obj.style = { strokeColor: 'CornflowerBlue' };
    obj.targetDecorator = { shape: 'Arrow', height: 10, width: 10, style: { fill: 'CornflowerBlue', strokeColor: 'white' } };
    return obj;
  }
  public selectionChange(args: ISelectionChangeEventArgs)
  {
  }

  public click(args: IClickEventArgs)
  {
    if (args.element && (args.element as any).sourceID === undefined && (args.element as any).shape !== undefined)
    {

    }
  }
  constructor(
    private http: HttpClient
  ) { }
  ngOnInit(): void
  {
    this.http.get<OrganizationRole[]>('assets/data/role-with-user.json')
      .subscribe((data: OrganizationRole[]) =>
      {
        data.forEach(role => role.expanded = true);
        this.updateDataSource(data);
      });
  }

  ngOnChanges(changes: SimpleChanges): void
  {
    const data = changes['listData'];
    const listData = data.currentValue as OrganizationChartEventArgs;
    if (listData)
    {
      switch (listData.eventType)
      {
        case ContextMenuItems.AddRole:
          this.addRole(listData.data.data);
          break;
        case ContextMenuItems.AddUser:
          this.addUser(listData.data.data);
          break;
        case ContextMenuItems.ShowHideUsers:
          this.toggleUser(listData.data.data);
          break;
        case ContextMenuItems.ShowHideRole:
          this.toggleRole(listData.data.data);
          break;
        case ContextMenuItems.RemoveRole:
          this.onRemoveRole(listData.data.data);
          break;
        case ContextMenuItems.RemoveUser:
          this.onRemoveUser(listData.data.data);
          break;
      }
    }
  }

  private addRole(roleData: OrganizationRole | ToggleItem)
  {
    const dataManager = this.dataSourceSettings.dataSource as DataManager;
    let originalData = dataManager.dataSource.json as OrganizationRole[];
    originalData.push(roleData as OrganizationRole);
    this.updateDataSource(originalData);
  }

  private addUser(roleData: OrganizationRole | ToggleItem)
  {
    const data = roleData as OrganizationRole;
    const dataManager = this.dataSourceSettings.dataSource as DataManager;
    let originalData = dataManager.dataSource.json as OrganizationRole[];
    let role = originalData.find(r => r.id === data.pid);
    if (role)
    {
      const user: EntityRef = { id: roleData.id, name: data.name };
      if (role.users)
      {
        role.users.push(user);
      } else
      {
        role.users = [user];
      }
    }
    this.updateDataSource(originalData);
  }

  private toggleUser(args: OrganizationRole | ToggleItem)
  {
    const data = args as ToggleItem;

    const dataManager = this.dataSourceSettings.dataSource as DataManager;
    let originalData = dataManager.dataSource.json as OrganizationRole[];

    if (data.id == 'all')
    {
      originalData = originalData.map(r => ({ ...r, users: r.users?.map(u => ({ ...u, hidden: !data.showData })) }));
    } else
    {
      const role = originalData.find(r => r.id === data.id);
      if (role)
      {
        role.users = role.users?.map(u => ({ ...u, hidden: !data.showData }));
      }
    }
    this.updateDataSource(originalData);
  }

  private toggleRole(args: OrganizationRole | ToggleItem)
  {
    const data = args as ToggleItem;

    const dataManager = this.dataSourceSettings.dataSource as DataManager;
    let originalData = dataManager.dataSource.json as OrganizationRole[];
    //originalData = originalData.map(r => ({ ...r, hidden:!data.showData, users: r.users?.map(u => ({ ...u, hidden: !data.showData })) }));
    originalData = originalData.map(r =>
      r.id === data.id || r.pid === data.id
        ? { ...r, hidden: !data.showData, users: r.users?.map(u => ({ ...u, hidden: !data.showData })) }
        : r
    );

    this.updateDataSource(originalData);
  }

  private onRemoveRole(args: OrganizationRole | ToggleItem)
  {
    const data = args as ToggleItem;

    const dataManager = this.dataSourceSettings.dataSource as DataManager;
    let originalData = dataManager.dataSource.json as OrganizationRole[];
    originalData = originalData.filter(r => r.id !== data.id);
    this.updateDataSource(originalData);
  }
  private onRemoveUser(args: OrganizationRole | ToggleItem)
  {
    const data = args as ToggleItem;

    const dataManager = this.dataSourceSettings.dataSource as DataManager;
    let originalData = dataManager.dataSource.json as OrganizationRole[];
    const roleData = originalData.find(r => r.id == data.pid);
    if (roleData && roleData.users && roleData.users.length > 0)
    {
      roleData.users = roleData.users?.filter(u => u.id !== data.id);
    }
    this.updateDataSource(originalData);
  }

  private updateDataSource(dataSource: OrganizationRole[]): void
  {
    this.dataSourceSettings = {
      ...this.dataSourceSettings,
      dataSource: new DataManager(dataSource),
      doBinding: this.bindNodeData.bind(this)
    };

    // if (this.diagram)
    // {
    //   this.diagram.dataBind();
    //   this.diagram.doLayout();
    //   this.diagram.refresh();
    // }
  }


}


