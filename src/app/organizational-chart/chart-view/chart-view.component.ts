import {
  ButtonModule,
  CheckBoxModule,
  RadioButtonModule,
} from '@syncfusion/ej2-angular-buttons';
import { DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import {
  NumericTextBoxModule,
  ColorPickerModule,
  UploaderModule,
  TextBoxModule,
} from '@syncfusion/ej2-angular-inputs';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { SplitButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { CircularGaugeModule, linear } from '@syncfusion/ej2-angular-circulargauge';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ListViewAllModule } from '@syncfusion/ej2-angular-lists';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import {
  DiagramAllModule,
  SymbolPaletteAllModule,
  OverviewAllModule,
} from '@syncfusion/ej2-angular-diagrams';
import {
  ChartAllModule,
} from '@syncfusion/ej2-angular-charts';
import { AccumulationChartModule } from '@syncfusion/ej2-angular-charts';
import { DialogAllModule } from '@syncfusion/ej2-angular-popups';
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  DiagramComponent,
  Diagram,
  NodeModel,
  ConnectorModel,
  LayoutAnimation,
  TreeInfo,
  SnapSettingsModel,
  DiagramTools,
  Node,
  DataBinding,
  HierarchicalTree,
  SnapConstraints
} from '@syncfusion/ej2-angular-diagrams';
import { DataManager } from '@syncfusion/ej2-data';
import { DataSourceModel, DiagramConstraints, IClickEventArgs, ISelectionChangeEventArgs, LayoutModel, NodeConstraints } from '@syncfusion/ej2-diagrams';
import { HttpClient } from '@angular/common/http';
import { Role, Role_Temp } from '../../models/role';
import { CommonModule } from '@angular/common';
Diagram.Inject(DataBinding, HierarchicalTree, LayoutAnimation);

export interface EmployeeInfo {
  Role: string;
  color: string;
}
export interface DataInfo {
  [key: string]: string;
}
@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrl: './chart-view.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    DiagramAllModule,
    ChartAllModule,
    GridAllModule,
    SymbolPaletteAllModule,
    OverviewAllModule,
    ButtonModule,
    ColorPickerModule,
    DateRangePickerModule,
    CheckBoxModule,
    AccumulationChartModule,
    ToolbarModule,
    DropDownButtonModule,
    UploaderModule,
    CircularGaugeModule,
    DropDownListAllModule,
    ListViewAllModule,
    DialogAllModule,
    TextBoxModule,
    RadioButtonModule,
    ComboBoxAllModule,
    SplitButtonModule,
    MultiSelectModule,
    NumericTextBoxModule,
    TreeViewModule,
    CommonModule
  ],
})
export class ChartViewComponent
{
  @ViewChild('diagram')
  public diagram!: DiagramComponent;
  public snapSettings: SnapSettingsModel = {
    constraints: SnapConstraints.None,
  };
  public tool = DiagramTools.Default;
  public diagramConstraints = DiagramConstraints.Default & ~DiagramConstraints.UserInteraction;
  public dataSourceSettings: DataSourceModel = {
    id: 'id',
    parentId: 'pid',
    dataSource: new DataManager([]),
    doBinding: (nodeModel: NodeModel, data: object, diagram: Diagram) => {
      nodeModel.id = (data as Role).id;
      nodeModel.data = data;
    }
  };
  public layout: LayoutModel = {
    type: 'HierarchicalTree',
    verticalSpacing: 60,
    horizontalSpacing: 40,
    enableAnimation: true,
    orientation: 'TopToBottom',
    margin: { top: 20, left: 20 },
    // Add branch spacing
    getBranch: (node: NodeModel) => {
      return !node.isExpanded;
    }
  };

  public created() {
    //this.diagram.created();
  }

  public nodeDefaults(node: NodeModel): NodeModel
  {
    node.shape = { type: 'HTML' };;
    node.width = 150;
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
  clicked(){
    alert('6516516')
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
    this.http.get<Role[]>('assets/data/role-with-user.json')
      .subscribe((data: Role[]) =>
      {
        data.forEach(role => role.expanded = true);
        this.dataSourceSettings = {
          id: 'id',
          parentId: 'pid',
          dataSource: new DataManager(data),
          doBinding: (nodeModel: NodeModel, data: object, diagram: Diagram) => {
            nodeModel.shape = {
              type: 'Text',
              content: (data as Role).name,
              margin: { left: 10, right: 10, top: 10, bottom: 10 },
            };
          },
        };
      });
  }
  // In chart-view-test.component.ts
  public toggleExpand(data: Role) {
    data.expanded = !data.expanded;

    if (this.diagram) {
      // Get the current diagram data
      const dataManager = this.dataSourceSettings.dataSource as DataManager;
      const originalData = dataManager.dataSource.json || dataManager.dataSource;

      // Update the node's expanded state
      const updatedNode = (originalData as Role[]).find((item: Role) => item.id === data.id);
      if (updatedNode) {
        updatedNode.expanded = data.expanded;
      }

      // Clear existing nodes and connectors
      this.diagram.clear();

      // Update the datasource
      this.dataSourceSettings = {
        id: 'id',
        parentId: 'pid',
        dataSource: new DataManager(originalData),
        doBinding: (nodeModel: NodeModel, data: object, diagram: Diagram) => {
          nodeModel.shape = {
            type: 'Text',
            content: (data as Role).name,
            margin: { left: 10, right: 10, top: 10, bottom: 10 },
          };
          // Set collapsed state
          nodeModel.isExpanded = (data as Role).expanded;
        },
      };

      // Force diagram to update
      this.diagram.updateConnectorEdges;
      this.diagram.dataBind();
      this.diagram.doLayout();
    }
  }
  }


