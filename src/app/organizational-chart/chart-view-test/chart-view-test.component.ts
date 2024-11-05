import { Component, ViewEncapsulation, ViewChild, TemplateRef } from '@angular/core';
import { IClickEventArgs, ISelectionChangeEventArgs, NodeConstraints, DiagramModule, OverviewModule } from '@syncfusion/ej2-angular-diagrams';
import
{
  Diagram,
  NodeModel,
  ConnectorModel,
  LayoutAnimation,
  DataBinding,
  HierarchicalTree,
  SnapConstraints,
  SnapSettingsModel,
  DiagramTools,
  Container,
  StackPanel,
  TextElement,
} from '@syncfusion/ej2-diagrams';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { HttpClient } from '@angular/common/http';
import { Role } from '../../models/role';
import { RoleWithUsers } from '../list-view/list-view.component';
import { CommonModule } from '@angular/common';
Diagram.Inject(DataBinding, HierarchicalTree, LayoutAnimation);

@Component({
  selector: 'app-chart-view-test',
  templateUrl: './chart-view-test.component.html',
  styleUrl: './chart-view-test.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    ButtonModule,
    TreeViewModule,
    DiagramModule,
    CommonModule,
    OverviewModule
  ],
})
export class ChartViewTestComponent
{
  public connectorDefaults(obj: ConnectorModel, diagram: Diagram): ConnectorModel
  {
    obj.type = 'Orthogonal';
    obj.style = { strokeColor: 'CornflowerBlue' };
    obj.targetDecorator = { shape: 'Arrow', height: 10, width: 10, style: { fill: 'CornflowerBlue', strokeColor: 'white' } };
    return obj;
  }
  public nodeDefaults(node: NodeModel): NodeModel
  {
    node.width = 100;
    node.height = 40;
    node.style = { strokeWidth: 1, strokeColor: 'whitesmoke', fill: 'CornflowerBlue' };
    node.annotations = [{ content: (node.data as any).name, style: { color: 'white' } }];
    node.constraints = NodeConstraints.Default | NodeConstraints.AllowDrop;
    return node;
  }
  public layout: Object = {
    type: 'HierarchicalTree',
    verticalSpacing: 60,
    horizontalSpacing: 40,
    enableAnimation: true,
    orientation: 'TopToBottom'
  };
  public snapSettings: SnapSettingsModel = {
    constraints: SnapConstraints.None,
  };

  public tools = DiagramTools.Default;
  public dataSourceSettings: Object = {
    id: 'id',
    parentId: 'pid',
    dataSource: new DataManager([]),
    doBinding: (nodeModel: NodeModel, data: object, diagram: Diagram) => {
      nodeModel.id = (data as any).id;
      nodeModel.data = data;
    }
  };
  public textEdit(args: any)
  {
  }
  public drop(args: any)
  {

  }
  public dragEnter(args: any)
  {
  }

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void
  {
    this.http.get<Role[]>('assets/data/role-with-user.json')
      .subscribe((data: Role[]) =>
      {
        this.dataSourceSettings = {
          id: 'id',
          parentId: 'pid',
          dataSource: new DataManager(data),
          doBinding: (nodeModel: NodeModel, data: object, diagram: Diagram) => {
            nodeModel.id = (data as any).id;
            nodeModel.data = data;
            // Set appropriate size based on content
            nodeModel.width = 180;
            nodeModel.height = (data as any).isRole && (data as any).users?.length
              ? 40 + ((data as any).users.length * 25)
              : 40;
          }
        };
      });
  }


  protected setNodeTemplate(obj: NodeModel, diagram: Diagram): Container {
    const data = obj.data as Role;

    // Create the outer container for the node content.
    let content: StackPanel = new StackPanel();
    content.id = data.id + '_outerstack';
    content.orientation = 'Horizontal';
    content.style.strokeColor = 'gray';
    content.padding = { left: 5, right: 10, top: 5, bottom: 5 };

    // Create an image element for the employee image.
    let roleName: TextElement = new TextElement();
    roleName.content = data.name ? data.name : '';
    roleName.width = 100;
    roleName.height = 50;
    roleName.style.strokeColor = 'none';
    roleName.id = data.id;

    // Create an inner stack panel for text elements (name and designation).
    let innerStack: StackPanel = new StackPanel();
    innerStack.style.strokeColor = 'none';
    innerStack.margin = { left: 5, right: 0, top: 0, bottom: 0 };
    innerStack.id = data.id + '_innerstack';

    let users: TextElement[] = [];
    data.users?.forEach(user => {
        let text: TextElement = new TextElement();
        text.content = user.name || '';
        text.style.color = 'black';
        text.style.bold = true;
        text.style.strokeColor = 'none';
        text.horizontalAlignment = 'Left';
        text.style.fill = 'none';
        text.id = data.id + '_text';
        text.style.textWrapping = 'Wrap';
        users.push(text);
    });

    innerStack.children = users;
    content.children = [roleName, innerStack];

    return content;
}

}
